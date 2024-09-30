import express from "express";
import Studentmodel from '../Models/Student.js'
import Studentclassmap from '../Models/Studentclassmap.js'
import Studentmark from '../Models/Studentmark.js'
import mongoose from "mongoose";
import usermodal from '../Models/UserData.js'
import multer from "multer";
import { createWorker } from 'tesseract.js';

const router = express.Router();


router.post('/addstudent', async (req, res) => {
    try {


        const {
            stu_adm_no,
            stu_name,
            stu_father_name,
            stu_mother_name,
            stu_guardian_name,
            stu_guard_contactno,
            stu_guard_email,
            stu_contact_address,
            stu_adm_class,
            stu_remarks,
            class_section
        } = req.body.data;


        if (stu_adm_no &&
            stu_name &&
            stu_father_name &&
            stu_mother_name &&
            stu_guardian_name &&
            stu_guard_contactno &&
            stu_guard_email &&
            stu_contact_address &&
            stu_adm_class &&
            stu_remarks) {


            // let obj = req.body;

            await Studentmodel.find({ stu_adm_no: stu_adm_no }).then(async (redata) => {
                if (redata.length === 0) {
                    await Studentmodel.create({
                        stu_adm_no,
                        stu_name,
                        stu_father_name,
                        stu_mother_name,
                        stu_guardian_name,
                        stu_guard_contactno,
                        stu_guard_email,
                        stu_contact_address,
                        stu_adm_class,
                        stu_remarks
                    }).then(async (data) => {
                        if (data) {
                            // console.log(data);

                            let obj1 = {
                                stu_id: data._id,
                                stu_adm_no: data.stu_adm_no,
                                stu_roll_number: data.stu_adm_no,
                                class_no: data.stu_adm_class,
                                class_section,
                                academic_year: new Date().getFullYear()
                            }

                            await Studentclassmap.create(obj1).then((data) => {
                                if (data) {
                                    res.json({ status: 200, msg: "Student Detail Added Successfully" });
                                }

                            })

                        } else {
                            res.json({ status: 400, msg: "Details not added" });
                        }
                    })
                } else {
                    res.json({ status: 400, msg: "Admission no Already Exist" });
                }
            })

        } else {
            res.json({ status: 400, msg: "Field Required" });
        }

    } catch (error) {
        res.json({ status: 401, msg: "Something Went Wrong" });
    }
})


router.post('/getsingle', async (req, res) => {
    try {

        if (req.body.rollno) {
            // await Studentmodel.find({ stu_adm_no: { $regex: req.body.rollno, $options: "i" } }).then((data) => {
            //     res.json({ status: 200, msg: "Student Details", data: data });
            // })

            await Studentmodel.aggregate([
                { $match: { stu_adm_no: { $regex: req.body.rollno, $options: "i" } } },
                {
                    $lookup: {
                        from: "Studentclassmap",
                        localField: "stu_adm_no",
                        foreignField: "stu_roll_number",
                        as: "details"
                    }
                },
                {
                    $project: {
                        "stu_adm_no": 1,
                        "stu_name": 1,
                        "stu_father_name": 1,
                        "stu_mother_name": 1,
                        "stu_guardian_name": 1,
                        "stu_guard_contactno": 1,
                        "stu_guard_email": 1,
                        "stu_contact_address": 1,
                        "stu_adm_class": 1,
                        "stu_remarks": 1,
                        "details.class_section": 1
                    }
                }
            ]).then((data) => {

                let arr = []

                data.forEach((resData) => {

                    let obj = {
                        _id: resData._id,
                        stu_adm_no: resData.stu_adm_no,
                        stu_name: resData.stu_name,
                        stu_father_name: resData.stu_father_name,
                        stu_mother_name: resData.stu_mother_name,
                        stu_guardian_name: resData.stu_guardian_name,
                        stu_guard_contactno: resData.stu_guard_contactno,
                        stu_guard_email: resData.stu_guard_email,
                        stu_contact_address: resData.stu_contact_address,
                        stu_adm_class: resData.stu_adm_class,
                        stu_remarks: resData.stu_remarks,
                        class_section: resData.details[0].class_section
                    }

                    arr.push(obj)


                })

                if (arr.length === data.length) {
                    res.json({ status: 200, msg: "data", data: arr })
                }

            })

        } else {

            await Studentmodel.aggregate([
                { $match: {} },
                {
                    $lookup: {
                        from: "Studentclassmap",
                        localField: "stu_adm_no",
                        foreignField: "stu_roll_number",
                        as: "details"
                    }
                },
                {
                    $project: {
                        "stu_adm_no": 1,
                        "stu_name": 1,
                        "stu_father_name": 1,
                        "stu_mother_name": 1,
                        "stu_guardian_name": 1,
                        "stu_guard_contactno": 1,
                        "stu_guard_email": 1,
                        "stu_contact_address": 1,
                        "stu_adm_class": 1,
                        "stu_remarks": 1,
                        "details.class_section": 1
                    }
                },
                { $sort: { _id: -1 } }
            ]).then((data) => {

                let arr = []

                data.forEach((resData) => {

                    let obj = {
                        _id: resData._id,
                        stu_adm_no: resData.stu_adm_no,
                        stu_name: resData.stu_name,
                        stu_father_name: resData.stu_father_name,
                        stu_mother_name: resData.stu_mother_name,
                        stu_guardian_name: resData.stu_guardian_name,
                        stu_guard_contactno: resData.stu_guard_contactno,
                        stu_guard_email: resData.stu_guard_email,
                        stu_contact_address: resData.stu_contact_address,
                        stu_adm_class: resData.stu_adm_class,
                        stu_remarks: resData.stu_remarks,
                        class_section: resData.details[0].class_section
                    }

                    arr.push(obj)


                })

                if (arr.length === data.length) {
                    res.json({ status: 200, msg: "data", data: arr })
                }

            })

            // res.json({ status: 400, msg: "rollno field required" });
        }


    } catch (error) {

        console.log("error", error);

        res.json({ status: 401, msg: "Something Went Wrong" });
    }
})


router.post('/detaData', async (req, res) => {
    try {

        const { _id } = req.body;

        await Studentmodel.findOne({ _id: _id }).then(async (resda) => {
            await Studentclassmap.findOneAndDelete({ stu_adm_no: resda.stu_adm_no }).then(async (refs) => {
                await Studentmodel.findOneAndDelete({ _id: _id }).then(() => {
                    res.json({ status: 200, msg: "Details deleted Successfully" });
                })
            })
        })

    } catch (error) {

    }
})


router.post('/getById', async (req, res) => {
    try {
        const { _id } = req.body;
        await Studentmodel.aggregate([
            { $match: { _id: new mongoose.Types.ObjectId(_id) } },
            {
                $lookup: {
                    from: "Studentclassmap",
                    localField: "_id",
                    foreignField: "stu_id",
                    as: "details"
                }
            },
            {
                $project: {
                    "stu_adm_no": 1,
                    "stu_name": 1,
                    "stu_father_name": 1,
                    "stu_mother_name": 1,
                    "stu_guardian_name": 1,
                    "stu_guard_contactno": 1,
                    "stu_guard_email": 1,
                    "stu_contact_address": 1,
                    "stu_adm_class": 1,
                    "stu_remarks": 1,
                    "details.class_section": 1
                }
            }
        ]).then((data) => {

            let arr = []

            data.forEach((resData) => {

                let obj = {
                    _id: resData._id,
                    stu_adm_no: resData.stu_adm_no,
                    stu_name: resData.stu_name,
                    stu_father_name: resData.stu_father_name,
                    stu_mother_name: resData.stu_mother_name,
                    stu_guardian_name: resData.stu_guardian_name,
                    stu_guard_contactno: resData.stu_guard_contactno,
                    stu_guard_email: resData.stu_guard_email,
                    stu_contact_address: resData.stu_contact_address,
                    stu_adm_class: resData.stu_adm_class,
                    stu_remarks: resData.stu_remarks,
                    class_section: resData.details[0].class_section
                }

                arr.push(obj)


            })

            if (arr.length === data.length) {
                res.json({ status: 200, msg: "data", data: arr })
            }

        })


    } catch (error) {
        console.log("error", error);
    }
})


router.post('/updateData', async (req, res) => {
    try {

        let info = req.body.data;

        const a = await Studentmodel.findOneAndUpdate({ _id: info._id }, { $set: info }, { new: true })
        if (a) {
            await Studentclassmap.findOneAndUpdate({ stu_id: new mongoose.Types.ObjectId(info._id) }, { $set: { class_section: info.class_section, stu_adm_no: a.stu_adm_no, stu_roll_number: a.stu_adm_no, class_no: a.stu_adm_class } }, { new: true }).then((resdata) => {
                if (resdata) {
                    res.json({ status: 200, msg: "Updated Successfully" })
                }
            })
        }

    } catch (error) {

    }
})


router.post('/addExamdetail', async (req, res) => {
    try {

        let info = req.body.data;

        await Studentmark.create(info).then((resdata) => {
            if (resdata) {
                res.json({ status: 200, msg: "Exam details added successfully" });
            }
        })

    } catch (error) {
        console.log("error", error)
    }
})

router.post('/getExamdetail', async (req, res) => {
    try {

        let info = req.body.rollno;
        await Studentmark.find({student_rollno:info}).then((resdata)=>{
          if(resdata.length > 0){
            res.json({status:200,msg:"Exam Detail",data:resdata})
          }
        })
       

    } catch (error) {
        console.log("error", error)
    }
})


router.post('/getExamdetailbyId', async (req, res) => {
    try {

        let info = req.body._id;
        await Studentmark.findOne({_id:info}).then((resdata)=>{
          if(resdata){
            res.json({status:200,msg:"Exam Details",data:resdata})
          }
        })
       

    } catch (error) {
        console.log("error", error)
    }
})




const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads'); // Set the upload directory
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname); // Use the original file name
    }
});

const upload = multer({ storage: storage });



router.get("/", async (req, res) => {
    res.json({ kid: "meee" });

});


router.post('/upload', upload.single('image'), async (req, res) => {


    let a = req.file;

    sample(a, async (cb) => {

        if (cb && cb) {



            const worker = await createWorker('eng');
            const ret = await worker.recognize(`https://airback.onrender.com/${cb}`);

            console.log("ret.data.text", ret.data.text);

            let converted_data = await convertStringToObject(ret.data.text);


            if (converted_data.Name && converted_data.JobTitle && converted_data.CompanyName && converted_data.Email && converted_data.PhoneNumber && converted_data.Address) {

                let obj = {
                    Name: converted_data?.Name || "-",
                    JobTitle: converted_data?.JobTitle || "-",
                    CompanyName: converted_data?.CompanyName || "-",
                    Email_Address: converted_data?.Email || "-",
                    PhoneNumber: converted_data?.PhoneNumber || "-",
                    image_path: cb,
                    Address: converted_data?.Address || "-"
                }

                await usermodal.find({
                    $and: [{
                        Name: converted_data.Name,
                        JobTitle: converted_data.JobTitle,
                        CompanyName: converted_data.CompanyName,
                        Email_Address: converted_data.Email,
                        PhoneNumber: converted_data.PhoneNumber,
                        image_path: cb,
                        Address: converted_data.Address
                    }]
                }).then(async (ddd) => {
                    if (ddd.length <= 0) {
                        await usermodal.create(obj).then((resd) => {
                            res.json({ status: 200, msg: "Details added successfully" });
                        });
                    } else {
                        res.json({ status: 400, msg: "Details of this visiting card is already exist" });
                    }
                });


            } else {
                res.json({ status: 400, msg: "Please upload valid visiting card" });
            }
        }
    });
});


async function sample(data, cb) {
    if (data && data.path) {
        console.log("data", data);
        cb(data.path);
    }
}


async function convertStringToObject(str) {
    const lines = str.split('\n').filter(line => line.trim() !== ''); // Split by newlines and remove empty lines
    const result = {};

    lines.forEach(line => {
        const [key, value] = line.split(':'); // Split by colon
        if (key && value) {
            result[key.trim()] = value.trim(); // Trim spaces and assign to object
        }
    });

    return result;
}


router.post('/cards', async (req, res) => {
    const perPage = 10;
    const page = Math.max(0, parseInt(req.body.page, 10) - 1 || 0);

    try {
        const resData = await usermodal.aggregate([
            {
                $facet: {
                    data: [
                        { $match: {} },
                        { $skip: perPage * page },
                        { $limit: perPage }
                    ],
                    count: [
                        { $count: "count" }
                    ]
                }
            }
        ]);

        const data = resData[0].data;
        const totalCount = resData[0].count[0] ? resData[0].count[0].count : 0;

        res.json({
            status: 200,
            msg: "Details",
            data: data,
            totalCount: totalCount,
            totalPages: Math.ceil(totalCount / perPage),
            currentPage: page + 1
        });

    } catch (error) {
        res.status(500).json({ status: 500, msg: "Error fetching data", error: error.message });
    }
});



export default router;