
const { MongoClient } = require('mongodb');

const url = 'mongodb://127.0.0.1:27017';
const client = new MongoClient(url);

async function main() {
    try {
        await client.connect();

        console.log('KET NOI MONGODB THANH CONG!');
        console.log('Ho ten: Vo Duy Anh');
        console.log('Ma sinh vien: CDCNTT18A04');
        console.log('Lop: CNTT18A');

        const db = client.db('qlsinhvien');

        const departments = db.collection('departments');
        const students = db.collection('students_join');

        // Lam sach hai collection de chay lai bai tap
        await departments.deleteMany({});
        await students.deleteMany({});

        // Them du lieu khoa
        await departments.insertMany([
            { makhoa: 'CNTT', tenkhoa: 'Cong nghe thong tin' },
            { makhoa: 'QTKD', tenkhoa: 'Quan tri kinh doanh' }
        ]);

        // Them du lieu sinh vien
        await students.insertMany([
            { masv: 'SV001', hoten: 'Vo Duy Anh', makhoa: 'CNTT' },
            { masv: 'SV002', hoten: 'Tran Thi Binh', makhoa: 'QTKD' },
            { masv: 'SV003', hoten: 'Le Van Cuong', makhoa: 'CNTT' },
            { masv: 'SV004', hoten: 'Pham Thi Dung', makhoa: 'QTKD' }
        ]);

        console.log('\nDA THEM DU LIEU KHOA VA SINH VIEN!');

        // Lien ket hai collection bang aggregate va $lookup
        const result = await students.aggregate([
            {
                $lookup: {
                    from: 'departments',
                    localField: 'makhoa',
                    foreignField: 'makhoa',
                    as: 'thongtin_khoa'
                }
            },
            {
                $unwind: '$thongtin_khoa'
            },
            {
                $project: {
                    _id: 0,
                    masv: 1,
                    hoten: 1,
                    makhoa: 1,
                    tenkhoa: '$thongtin_khoa.tenkhoa'
                }
            }
        ]).toArray();

        console.log('\nDANH SACH SINH VIEN VA TEN KHOA:');
        console.log(result);

    } catch (error) {
        console.error('LOI:', error);
    } finally {
        await client.close();
    }
}

main();
