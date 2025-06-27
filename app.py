from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
import jwt
import datetime
from functools import wraps
from pymongo import MongoClient
from bson import ObjectId
import logging

# Configure logging
logging.basicConfig(level=logging.DEBUG, format='%(asctime)s %(levelname)s: %(message)s')
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": ["http://localhost:5173", "http://localhost:5000"]}})
app.config['SECRET_KEY'] = 'your-secret-key'

# MongoDB Atlas connection
MONGO_URI = 'mongodb+srv://karan:<kaRanlande45>@cluster0.icdaxwo.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'
client = MongoClient(MONGO_URI)
db = client['physioconnect']
users_collection = db['users']
doctor_profiles_collection = db['doctor_profiles']
appointments_collection = db['appointments']
patient_profiles_collection = db['patient_profiles']

# Ensure indexes for unique constraints
try:
    logger.info("Creating indexes")
    users_collection.create_index('email', unique=True)
    logger.info("Indexes created successfully")
except Exception as e:
    logger.error(f"Error creating indexes: {str(e)}")

# Token verification decorator
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')
        if not token:
            logger.warning("Token missing in request")
            return jsonify({'error': 'Token is missing'}), 401
        try:
            if token.startswith('Bearer '):
                token = token.split(" ")[1]
            data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=["HS256"])
            current_user = users_collection.find_one({'_id': ObjectId(data['user_id'])})
            if not current_user:
                logger.warning(f"User not found for ID: {data['user_id']}")
                return jsonify({'error': 'User not found'}), 401
        except jwt.ExpiredSignatureError:
            logger.warning("Token expired")
            return jsonify({'error': 'Token has expired'}), 401
        except jwt.InvalidTokenError:
            logger.warning("Invalid token")
            return jsonify({'error': 'Invalid token'}), 401
        except Exception as e:
            logger.error(f"Token error: {str(e)}")
            return jsonify({'error': f'Token error: {str(e)}'}), 401
        return f(current_user, *args, **kwargs)
    return decorated

# Role-based access control decorator
def role_required(role):
    def decorator(f):
        @wraps(f)
        def decorated_function(current_user, *args, **kwargs):
            if current_user['role'] != role:
                logger.warning(f"Access denied for user ID {current_user['_id']}. Required role: {role}")
                return jsonify({'error': f'Access denied. {role} role required'}), 403
            return f(current_user, *args, **kwargs)
        return decorated_function
    return decorator

# Routes
@app.route('/signin', methods=['POST'])
def signin():
    try:
        data = request.get_json()
        if not data or not data.get('email') or not data.get('password'):
            logger.warning("Missing email or password in signin request")
            return jsonify({'error': 'Email and password are required'}), 400
        user = users_collection.find_one({'email': data.get('email')})
        if not user or not check_password_hash(user['password'], data.get('password')):
            logger.warning(f"Invalid credentials for email: {data.get('email')}")
            return jsonify({'error': 'Invalid credentials'}), 401
        token = jwt.encode({
            'user_id': str(user['_id']),
            'role': user['role'],
            'exp': datetime.datetime.utcnow() + datetime.timedelta(days=1)
        }, app.config['SECRET_KEY'], algorithm="HS256")
        logger.info(f"User {user['email']} signed in successfully")
        return jsonify({
            'access_token': token,
            'role': user['role'],
            'user': {
                'id': str(user['_id']),
                'email': user['email'],
                'role': user['role']
            }
        }), 200
    except Exception as e:
        logger.error(f"Signin error: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/signup', methods=['POST'])
def signup():
    try:
        data = request.get_json()
        if not data or not data.get('email') or not data.get('password'):
            logger.warning("Missing email or password in signup request")
            return jsonify({'error': 'Email and password are required'}), 400
        existing_user = users_collection.find_one({'email': data.get('email')})
        if existing_user:
            logger.warning(f"User already exists: {data.get('email')}")
            return jsonify({'error': 'User already exists'}), 400
        hashed_password = generate_password_hash(data.get('password'))
        new_user = {
            'email': data.get('email'),
            'password': hashed_password,
            'role': data.get('role', 'user'),
            'created_at': datetime.datetime.utcnow()
        }
        result = users_collection.insert_one(new_user)
        token = jwt.encode({
            'user_id': str(result.inserted_id),
            'role': new_user['role'],
            'exp': datetime.datetime.utcnow() + datetime.timedelta(days=1)
        }, app.config['SECRET_KEY'], algorithm="HS256")
        logger.info(f"User {new_user['email']} signed up successfully")
        return jsonify({
            'access_token': token,
            'role': new_user['role'],
            'user': {
                'id': str(result.inserted_id),
                'email': new_user['email'],
                'role': new_user['role']
            }
        }), 201
    except Exception as e:
        logger.error(f"Signup error: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/doctors', methods=['GET'])
def get_doctors():
    try:
        logger.info("Fetching all doctors")
        doctor_profiles = doctor_profiles_collection.find()
        doctors = []
        for profile in doctor_profiles:
            doctor = users_collection.find_one({'_id': ObjectId(profile['user_id']), 'role': 'doctor'})
            if doctor:
                doctors.append({
                    'id': str(profile['user_id']),
                    'name': profile['name'],
                    'specialty': profile.get('specialty', ''),
                    'bio': profile.get('bio', ''),
                    'experience': profile.get('experience', 0),
                    'email': doctor['email']
                })
        logger.info(f"Returning {len(doctors)} doctors")
        return jsonify(doctors), 200
    except Exception as e:
        logger.error(f"Get doctors error: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/doctor/add-profile', methods=['POST'])
@token_required
@role_required('doctor')
def add_doctor_profile(current_user):
    try:
        data = request.get_json()
        existing_profile = doctor_profiles_collection.find_one({'user_id': current_user['_id']})
        if existing_profile:
            logger.warning(f"Profile already exists for doctor ID: {current_user['_id']}")
            return jsonify({'error': 'Profile already exists for this doctor'}), 400
        new_profile = {
            'user_id': current_user['_id'],
            'name': data.get('name', ''),
            'specialty': data.get('specialty', ''),
            'bio': data.get('bio', ''),
            'experience': data.get('experience', 0)
        }
        result = doctor_profiles_collection.insert_one(new_profile)
        logger.info(f"Doctor profile created for user ID: {current_user['_id']}")
        return jsonify({
            'message': 'Doctor profile created successfully',
            'profileId': str(result.inserted_id)
        }), 201
    except Exception as e:
        logger.error(f"Add doctor profile error: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/doctor/<id>', methods=['GET'])
def get_doctor_profile(id):
    try:
        logger.info(f"Fetching doctor profile for ID: {id}")
        profile = doctor_profiles_collection.find_one({'user_id': ObjectId(id)})
        if not profile:
            logger.warning(f"Profile not found for user ID: {id}")
            return jsonify({'error': 'Profile not found'}), 404
        doctor = users_collection.find_one({'_id': ObjectId(id), 'role': 'doctor'})
        if not doctor:
            logger.warning(f"Invalid doctor profile for user ID: {id}")
            return jsonify({'error': 'Invalid doctor profile'}), 400
        logger.info(f"Returning doctor profile for ID: {id}")
        return jsonify({
            'id': str(profile['user_id']),
            'name': profile['name'],
            'specialty': profile.get('specialty', ''),
            'bio': profile.get('bio', ''),
            'experience': profile.get('experience', 0),
            'email': doctor['email']
        }), 200
    except Exception as e:
        logger.error(f"Get doctor profile error: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/doctor/profile/<profile_id>', methods=['PUT'])
@token_required
def update_doctor_profile(current_user, profile_id):
    try:
        logger.info(f"Updating doctor profile ID: {profile_id} for user ID: {current_user['_id']}")
        profile = doctor_profiles_collection.find_one({'_id': ObjectId(profile_id)})
        if not profile:
            logger.warning(f"Profile not found: {profile_id}")
            return jsonify({'error': 'Profile not found'}), 404
        if str(profile['user_id']) != str(current_user['_id']):
            logger.warning(f"Unauthorized update attempt by user ID: {current_user['_id']}")
            return jsonify({'error': 'Unauthorized'}), 403
        data = request.get_json()
        update_data = {}
        if 'name' in data:
            update_data['name'] = data['name']
        if 'specialty' in data:
            update_data['specialty'] = data['specialty']
        if 'bio' in data:
            update_data['bio'] = data['bio']
        if 'experience' in data:
            update_data['experience'] = data['experience']
        if update_data:
            doctor_profiles_collection.update_one(
                {'_id': ObjectId(profile_id)},
                {'$set': update_data}
            )
        logger.info(f"Doctor profile ID: {profile_id} updated successfully")
        updated_profile = doctor_profiles_collection.find_one({'_id': ObjectId(profile_id)})
        return jsonify({
            'message': 'Profile updated successfully',
            'profile': {
                'id': str(updated_profile['_id']),
                'user_id': str(updated_profile['user_id']),
                'name': updated_profile['name'],
                'specialty': updated_profile.get('specialty', ''),
                'bio': updated_profile.get('bio', ''),
                'experience': updated_profile.get('experience', 0)
            }
        }), 200
    except Exception as e:
        logger.error(f"Update doctor profile error: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/doctor/appointments', methods=['GET'])
@token_required
@role_required('doctor')
def get_doctor_appointments(current_user):
    try:
        logger.info(f"Starting get_doctor_appointments for doctor_id: {current_user['_id']}")
        appointments = appointments_collection.find({'doctor_id': current_user['_id']})
        formatted_appointments = []
        for appointment in appointments:
            try:
                logger.debug(f"Processing appointment ID: {appointment['_id']}")
                if not all([appointment.get('date'), appointment.get('time'), appointment.get('reason')]):
                    logger.warning(f"Invalid appointment data for ID: {appointment['_id']} - missing required fields")
                    continue
                patient = users_collection.find_one({'_id': ObjectId(appointment['user_id'])})
                if not patient:
                    logger.warning(f"Patient not found for user_id: {appointment['user_id']} in appointment ID: {appointment['_id']}")
                    continue
                patient_profile = patient_profiles_collection.find_one({'user_id': ObjectId(appointment['user_id'])})
                appointment_data = {
                    'id': str(appointment['_id']),
                    'user_id': str(appointment['user_id']),
                    'patient_name': patient_profile['name'] if patient_profile else patient['email'],
                    'patient_email': patient['email'],
                    'date': appointment['date'] or 'Unknown',
                    'time': appointment['time'] or 'Unknown',
                    'reason': appointment['reason'] or 'Not specified',
                    'status': appointment['status'] or 'pending',
                    'notes': appointment['notes'] or ''
                }
                formatted_appointments.append(appointment_data)
                logger.debug(f"Successfully processed appointment ID: {appointment['_id']}")
            except Exception as e:
                logger.error(f"Error processing appointment ID {appointment['_id']}: {str(e)}")
                continue
        logger.info(f"Returning {len(formatted_appointments)} formatted appointments")
        return jsonify(formatted_appointments), 200
    except Exception as e:
        logger.error(f"Critical error in get_doctor_appointments: {str(e)}")
        return jsonify({'error': f'Internal server error: {str(e)}'}), 500

@app.route('/patient/appointments', methods=['GET'])
@token_required
def get_patient_appointments(current_user):
    try:
        logger.info(f"Fetching patient appointments for user_id: {current_user['_id']}")
        appointments = appointments_collection.find({'user_id': current_user['_id']})
        formatted_appointments = []
        for appointment in appointments:
            doctor = users_collection.find_one({'_id': ObjectId(appointment['doctor_id'])})
            doctor_profile = doctor_profiles_collection.find_one({'user_id': ObjectId(appointment['doctor_id'])})
            formatted_appointments.append({
                'id': str(appointment['_id']),
                'doctor_id': str(appointment['doctor_id']),
                'doctor_name': doctor_profile['name'] if doctor_profile else 'Unknown',
                'doctor_email': doctor['email'] if doctor else 'Unknown',
                'date': appointment['date'] or 'Unknown',
                'time': appointment['time'] or 'Unknown',
                'reason': appointment['reason'] or 'Not specified',
                'status': appointment['status'] or 'pending',
                'notes': appointment['notes'] or ''
            })
        logger.info(f"Returning {len(formatted_appointments)} patient appointments")
        return jsonify(formatted_appointments), 200
    except Exception as e:
        logger.error(f"Error in get_patient_appointments: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/appointments/<appointment_id>/status', methods=['PUT'])
@token_required
def update_appointment_status(current_user, appointment_id):
    try:
        logger.info(f"Updating status for appointment ID: {appointment_id}")
        data = request.get_json()
        if not data or not data.get('status'):
            logger.warning("Missing status in update request")
            return jsonify({'error': 'Status is required'}), 400
        valid_statuses = ['pending', 'accepted', 'declined', 'completed', 'cancelled']
        if data.get('status') not in valid_statuses:
            logger.warning(f"Invalid status: {data.get('status')}")
            return jsonify({'error': f'Invalid status. Must be one of: {", ".join(valid_statuses)}'}), 400
        appointment = appointments_collection.find_one({'_id': ObjectId(appointment_id)})
        if not appointment:
            logger.warning(f"Appointment not found: {appointment_id}")
            return jsonify({'error': 'Appointment not found'}), 404
        if current_user['role'] == 'doctor' and str(appointment['doctor_id']) != str(current_user['_id']):
            logger.warning(f"Unauthorized doctor access for appointment ID: {appointment_id}")
            return jsonify({'error': 'Unauthorized. Not your appointment'}), 403
        elif current_user['role'] == 'user' and str(appointment['user_id']) != str(current_user['_id']):
            logger.warning(f"Unauthorized patient access for appointment ID: {appointment_id}")
            return jsonify({'error': 'Unauthorized. Not your appointment'}), 403
        old_status = appointment['status']
        update_data = {'status': data.get('status')}
        if data.get('notes'):
            notes = appointment.get('notes', '')
            new_note = f"[{datetime.datetime.utcnow().strftime('%Y-%m-%d %H:%M')}] {data.get('notes')}"
            update_data['notes'] = f"{notes}\n{new_note}" if notes else new_note
        appointments_collection.update_one(
            {'_id': ObjectId(appointment_id)},
            {'$set': update_data}
        )
        logger.info(f"Appointment ID: {appointment_id} status updated to {data.get('status')}")
        return jsonify({
            'message': f'Appointment status updated from {old_status} to {data.get("status")}',
            'status': data.get('status')
        }), 200
    except Exception as e:
        logger.error(f"Error in update_appointment_status: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/appointments', methods=['POST'])
@token_required
def create_appointment(current_user):
    try:
        logger.info(f"Creating appointment for user ID: {current_user['_id']}")
        data = request.get_json()
        logger.debug(f"Received payload: {data}")

        # Validate required fields
        required_fields = ['doctor_id', 'date', 'time', 'reason']
        missing_fields = [field for field in required_fields if not data.get(field)]
        if missing_fields:
            logger.warning(f"Missing required fields: {missing_fields}")
            return jsonify({'error': f'Missing required fields: {", ".join(missing_fields)}'}), 400

        # Validate doctor_id
        try:
            doctor_id = ObjectId(data.get('doctor_id'))
        except Exception:
            logger.warning(f"Invalid doctor_id: {data.get('doctor_id')}")
            return jsonify({'error': 'Doctor ID must be a valid ObjectId'}), 400

        # Check if doctor exists and has correct role
        doctor = users_collection.find_one({'_id': doctor_id, 'role': 'doctor'})
        if not doctor:
            logger.warning(f"Doctor not found or invalid role for ID: {doctor_id}")
            return jsonify({'error': 'Doctor not found or invalid'}), 404

        # Validate date and time
        try:
            appointment_date = datetime.datetime.strptime(data.get('date'), '%Y-%m-%d').strftime('%Y-%m-%d')
            appointment_time = datetime.datetime.strptime(data.get('time'), '%H:%M').strftime('%H:%M')
        except ValueError as e:
            logger.warning(f"Invalid date or time format: {str(e)}")
            return jsonify({'error': 'Invalid date or time format. Use YYYY-MM-DD for date and HH:MM for time'}), 400

        # Validate reason length
        if len(data.get('reason')) > 200:
            logger.warning("Reason exceeds maximum length of 200 characters")
            return jsonify({'error': 'Reason must not exceed 200 characters'}), 400

        # Check for existing appointment
        logger.debug(f"Checking for existing appointment: doctor_id={doctor_id}, date={appointment_date}, time={appointment_time}")
        existing_appointment = appointments_collection.find_one({
            'doctor_id': doctor_id,
            'date': appointment_date,
            'time': appointment_time
        })
        if existing_appointment:
            logger.warning(f"Time slot already booked: {appointment_date} {appointment_time}")
            return jsonify({'error': 'Time slot already booked'}), 409

        # Create new appointment
        logger.debug("Creating new appointment")
        new_appointment = {
            'doctor_id': doctor_id,
            'user_id': current_user['_id'],
            'date': appointment_date,
            'time': appointment_time,
            'reason': data.get('reason'),
            'notes': data.get('notes', ''),
            'status': 'pending',
            'created_at': datetime.datetime.utcnow()
        }
        result = appointments_collection.insert_one(new_appointment)
        logger.info(f"Appointment created successfully: ID {result.inserted_id}")

        return jsonify({
            'message': 'Appointment created successfully',
            'appointment': {
                'id': str(result.inserted_id),
                'doctor_id': str(new_appointment['doctor_id']),
                'date': new_appointment['date'],
                'time': new_appointment['time'],
                'reason': new_appointment['reason'],
                'status': new_appointment['status'],
                'notes': new_appointment['notes']
            }
        }), 201
    except Exception as e:
        logger.error(f"Error in create_appointment: {str(e)}")
        return jsonify({'error': f'Internal server error: {str(e)}'}), 500

@app.route('/appointments/<appointment_id>', methods=['DELETE'])
@token_required
def delete_appointment(current_user, appointment_id):
    try:
        logger.info(f"Deleting appointment ID: {appointment_id}")
        appointment = appointments_collection.find_one({'_id': ObjectId(appointment_id)})
        if not appointment:
            logger.warning(f"Appointment not found: {appointment_id}")
            return jsonify({'error': 'Appointment not found'}), 404
        if current_user['role'] == 'doctor' and str(appointment['doctor_id']) != str(current_user['_id']):
            logger.warning(f"Unauthorized doctor delete attempt for appointment ID: {appointment_id}")
            return jsonify({'error': 'Unauthorized. Not your appointment'}), 403
        elif current_user['role'] == 'user' and str(appointment['user_id']) != str(current_user['_id']):
            logger.warning(f"Unauthorized patient delete attempt for appointment ID: {appointment_id}")
            return jsonify({'error': 'Unauthorized. Not your appointment'}), 403
        appointments_collection.delete_one({'_id': ObjectId(appointment_id)})
        logger.info(f"Appointment ID: {appointment_id} deleted successfully")
        return jsonify({'message': 'Appointment deleted successfully'}), 200
    except Exception as e:
        logger.error(f"Error in delete_appointment: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/patient/profile', methods=['POST'])
@token_required
def add_patient_profile(current_user):
    try:
        logger.info(f"Adding patient profile for user ID: {current_user['_id']}")
        data = request.get_json()
        existing_profile = patient_profiles_collection.find_one({'user_id': current_user['_id']})
        if existing_profile:
            logger.warning(f"Profile already exists for user ID: {current_user['_id']}")
            return jsonify({'error': 'Profile already exists for this patient'}), 400
        new_profile = {
            'user_id': current_user['_id'],
            'name': data.get('name', ''),
            'age': data.get('age'),
            'medical_history': data.get('medical_history', '')
        }
        result = patient_profiles_collection.insert_one(new_profile)
        logger.info(f"Patient profile created for user ID: {current_user['_id']}")
        return jsonify({
            'message': 'Patient profile created successfully',
            'profileId': str(result.inserted_id)
        }), 201
    except Exception as e:
        logger.error(f"Error in add_patient_profile: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/profile', methods=['GET'])
@token_required
def get_user_profile(current_user):
    try:
        logger.info(f"Fetching profile for user ID: {current_user['_id']}")
        result = {
            'id': str(current_user['_id']),
            'email': current_user['email'],
            'role': current_user['role']
        }
        if current_user['role'] == 'doctor':
            profile = doctor_profiles_collection.find_one({'user_id': current_user['_id']})
            if profile:
                result['profile'] = {
                    'id': str(profile['_id']),
                    'name': profile['name'],
                    'specialty': profile.get('specialty', ''),
                    'bio': profile.get('bio', ''),
                    'experience': profile.get('experience', 0)
                }
        else:
            profile = patient_profiles_collection.find_one({'user_id': current_user['_id']})
            if profile:
                result['profile'] = {
                    'id': str(profile['_id']),
                    'name': profile['name'],
                    'age': profile.get('age'),
                    'medical_history': profile.get('medical_history', '')
                }
        logger.info(f"Returning profile for user ID: {current_user['_id']}")
        return jsonify(result), 200
    except Exception as e:
        logger.error(f"Error in get_user_profile: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/', methods=['GET'])
def test():
    logger.info("API test endpoint accessed")
    return jsonify({'message': 'PhysioConnect API is working'}), 200

if __name__ == '__main__':
    logger.info("Starting Flask application")
    app.run(debug=True, port=5000)