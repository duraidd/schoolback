import express from "express";
import Studentmodel from '../Models/Student.js'
import Studentclassmap from '../Models/Studentclassmap.js'
import mongoose from "mongoose";
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
                }else{
                    res.json({status:400,msg:"Admission no Already Exist"});
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


export default router;