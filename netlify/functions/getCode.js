const { MongoClient } = require('mongodb');

// เชื่อมต่อกับ MongoDB
const uri = process.env.MONGODB_URI || 'mongodb+srv://suriyabarisi:<db_password>@cluster0.yhgme.mongodb.net/'; // ใช้ environment variable สำหรับ MongoDB URI
const client = new MongoClient(uri);

exports.handler = async function(event, context) {
    if (event.httpMethod === 'GET') {
        const studentId = event.queryStringParameters.studentId;

        try {
            await client.connect();
            const database = client.db('assigment_db'); // แทนที่ด้วยชื่อฐานข้อมูลของคุณ
            const collection = database.collection('assignment_codes'); // แทนที่ด้วยชื่อ collection ของคุณ

            const result = await collection.findOne({ studentId: studentId });
            await client.close();

            if (result) {
                return {
                    statusCode: 200,
                    body: JSON.stringify({
                        individual_code: result.individual_code,
                        group_code: result.group_code
                    }),
                };
            } else {
                return {
                    statusCode: 404,
                    body: JSON.stringify({ message: 'No code found' }),
                };
            }
        } catch (error) {
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
