// for Creating the service
import nodeMailer from "nodemailer";
import adminLogin from "../db/adminSchema.js"
import ServiceList from "../db/serviceSchema.js"
import UserBooking from "../db/userBookingdetails.js"
import generateToken from "../utils/createToken.js"
import { serviceList } from "./userLogic.js"


const add = async(req, res) => {
    res.render('admin/addServices')
}


const addService = async(req, res) => {
    const { serviceName } = req.body
    console.log("Service Name :", serviceName)
    try {
        let name = new ServiceList({ service: serviceName})
        await name.save()

        if(name){
            res.redirect('/api/admin/addService?status=added')
        }

    } catch (error) {
        res.redirect('/api/admin/addService?status=error')
        console.log("cannot Add Service\n", error)
    }
}

const bookings = async(req, res) => {
    try {
        const bookingDetails = await UserBooking.find()
        if(!bookingDetails){
            alert("No Booking details")
        }
        
        bookingDetails.forEach(detail => {
            console.log('Booking Id:', detail._id);
        });

        res.render('admin/bookings', {Details : bookingDetails})

    } catch (error) {
        console.log("Cannot fetch booking details")
    }
}



const mainPage = async (req, res) => {
    try {
        const totalBooking = await UserBooking.countDocuments({})
        const totalPending = await UserBooking.countDocuments({status : 'pending'})
        const totalCompleted = await UserBooking.countDocuments({status : 'completed'})

        res.render('admin/index', {totalBooking, totalCompleted, totalPending})

    } catch (error) {
        console.log(error)
    }
}

const updateStatus = async(req, res) => {
    const { booking_id } = req.body

    try {
        const updatedStatus = await UserBooking.find({
            _id : booking_id
        })
        if(!updatedStatus){
            res.json({message : "no id found"})
        }
        console.log('updated details :', updatedStatus)
        res.render('admin/updateStatus', { details : updatedStatus})
    } catch (error) {
        console.log("cannot Update status")
        res.json({message : "cannot update status"})
    }
}

const confirmUpdateUser = async(req, res) => {
    const { id, status } = req.body

    try {
       
        const updateDetails = await UserBooking.findByIdAndUpdate(
            id,
            {status : status},

            { new : true, runValidators : true },
        )

        if(!updateDetails){
            res.json({message : "User details not found"})
        }
        const totalBooking = await UserBooking.countDocuments({})
        const totalPending = await UserBooking.countDocuments({status : 'pending'})
        const totalCompleted = await UserBooking.countDocuments({status : 'completed'})

        const mailDetails = await UserBooking.findOne({
            _id : id
        })

        console.log("Mail Details :", mailDetails)

        let {userName, regno, brand, model, userPhoneNumber, email} = mailDetails
        console.log(userName, regno, brand, model, userPhoneNumber, email)

        let transporter = nodeMailer.createTransport({
            service: "Gmail",
            auth: {
              user: `yogesh.5prog@gmail.com`,
              pass: `ovuz qrwq tmjd qqrq`,
            },
          });
          let mailOptions = {
            from: "yogesh.5prog@gmail.com",
            to: email,
            subject: `Bike Service Delivery`,
            html: `
                  
                      <div>
                          Dear ${userName},<br>
                          I hope this email find you well! <br>
                          Your bike is ready for delivery  <br>
                          <h2>BIKE DETAILS</h2> <br>
                          <br>
                          Brand : ${brand}<br>
                          Model : ${model}<br>
                          Reg. No : ${regno}<br>
          
                          Visit our showroom for further assistance :) <br>
                          <br>
                          Thankyou for choosing our service :)
                      </div>
                  `,
          };
          mailOptions.contentType = "txt/html";
      
          transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
              console.log(error);
              res.status(500).send("Error sending email");
            } else {
              console.log("email sent :", info.response);
              res.render('admin/index', {totalBooking, totalCompleted, totalPending})
            }
          });
        

       
    } catch (error) {
        console.log(error)
    }
}



const loginAdmin = async(req, res) => {
    const { email , password } = req.body
    console.log(email, password)
  
    try {
      const existingUser = await adminLogin.findOne({
        email
      })
      if(existingUser && existingUser.password === password){
        generateToken(res, existingUser._id)
        res.status(200).redirect('/api/admin')
      }else{
        res.redirect('/login')
      }
  
    } catch (error) {
      console.error('Error during login process:', error.message);
      return res.status(500).send('Error during login process');
    }
  }

export {addService, bookings, mainPage, add, updateStatus, confirmUpdateUser, loginAdmin}