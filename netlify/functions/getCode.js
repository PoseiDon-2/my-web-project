const { MongoClient } = require('mongodb');

// ใช้ Environment Variable สำหรับ MongoDB URI
const uri = process.env.MONGODB_URI || 'mongodb+srv://your_username:your_password@cluster0.your_cluster.mongodb.net/your_database?retryWrites=true&w=majority';
const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    connectTimeoutMS: 10000,  // 10 seconds
    socketTimeoutMS: 30000    // 30 seconds
});

exports.handler = async function(event, context) {
    if (event.httpMethod === 'GET') {
        const studentId = event.queryStringParameters.studentId;
        const type = event.queryStringParameters.type; // type can be 'individual' or 'group'

        console.log('Student ID:', studentId);

        try {
            console.log('Connecting to MongoDB...');
            await client.connect();
            console.log('Connected to MongoDB');

            const database = client.db('assigment_db'); // แทนที่ด้วยชื่อฐานข้อมูลของคุณ
            const collection = database.collection('assignment_codes'); // แทนที่ด้วยชื่อ collection ของคุณ

            const result = await collection.findOne({ studentId: studentId });
            console.log('Query Result:', result);

            await client.close();

            if (result) {
                if (type === 'individual') {
                    return {
                        statusCode: 200,
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ code: result.individual_code }),
                    };
                } else if (type === 'group') {
                    return {
                        statusCode: 200,
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ code: result.group_code }),
                    };
                } else {
                    return {
                        statusCode: 400,
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ message: 'Invalid type parameter' }),
                    };
                }
            } else {
                return {
                    statusCode: 404,
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ message: 'No code found' }),
                };
            }
        } catch (error) {
            console.error('Error:', error);
            return {
                statusCode: 500,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ message: 'Internal Server Error', error: error.message }),
            };
        }
    } else {
        return {
            statusCode: 405,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message: 'Method Not Allowed' }),
        };
    }
};
