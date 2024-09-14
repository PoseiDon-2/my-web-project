const express = require('express');
const {MongoClient} = require('mongodb');
const bodyParser = require('body-parser');


// สรา้างแอปพลิเคชัน Express
const app = express();
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// เชื่อมต่อฐานข้อมูล
const uri = 'mongodb://localhost:27017';
const client = new MongoClient(uri);

async function connectDb() {
    await client.connect();
    console.log('Connected to MongoDB');
    return client.db('assigment_db').collection('assignment_codes');
}


// ส่งไฟล์ HTML ฟอร์ม
app.get('/',(req, res) =>{
    res.sendFile(__dirname + '/index.html');
});

app.post('/submit', async (req, res) => {
    const {student_id} = req.body;
    try {
        const collection = await connectDb();

        const result = await collection.findOne({ student_id: student_id });

        if (result){
            const { group_code, individual_code } = result;
            // แสดงรหัสส่งงานบนหน้าเว็บ
            res.send(`
                <h2>รหัสส่งงานของคุณ</h2>
                <p>รหัสส่งงานแบบกลุ่ม: ${group_code} </p>
                <p>รหัสส่งงานแบบเดี่ยว: ${individual_code} </p>
                `);
        } else{
            res.send('ไม่พบข้อมูลรหัสนักศึกษาในระบบ');
        }
    } catch (err){
        console.error(err);
        res.status(500).send('Error connecting to database');
    }
});

// ตั้งค่า Port 3000
app.listen(3000, () =>{
    console.log('Server is running on http://localhost:3000');
});