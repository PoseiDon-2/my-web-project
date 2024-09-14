const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI || 'mongodb+srv://suriyabarisi:<db_password>@cluster0.yhgme.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
const client = new MongoClient(uri);

exports.handler = async function(event, context) {
    if (event.httpMethod === 'GET') {
        const studentId = event.queryStringParameters.studentId;
        const type = event.queryStringParameters.type; // type can be 'individual' or 'group'

        console.log('Student ID:', studentId);
        console.log('Type:', type);

        try {
            console.log('Connecting to MongoDB...');
            await client.connect();
            console.log('Connected to MongoDB');

            const database = client.db('assignment_db');
            const collection = database.collection('assignment_codes');

            const result = await collection.findOne({ studentId: studentId });
            console.log('Query Result:', result);

            await client.close();

            if (result) {
                if (type === 'individual') {
                    return {
                        statusCode: 200,
                        body: JSON.stringify({ code: result.individual_code }),
                    };
                } else if (type === 'group') {
                    return {
                        statusCode: 200,
                        body: JSON.stringify({ code: result.group_code }),
                    };
                } else {
                    return {
                        statusCode: 400,
                        body: JSON.stringify({ message: 'Invalid type parameter' }),
                    };
                }
            } else {
                return {
                    statusCode: 404,
                    body: JSON.stringify({ message: 'No code found' }),
                };
            }
        } catch (error) {
            console.error('Error:', error);
            return {
                statusCode: 500,
                body: JSON.stringify({ message: 'Internal Server Error', error: error.message }),
            };
        }
    } else {
        return {
            statusCode: 405,
            body: JSON.stringify({ message: 'Method Not Allowed' }),
        };
    }
};
