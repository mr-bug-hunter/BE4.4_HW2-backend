const express = require('express')
const app = express()

const {initialization} = require("./db/db.connect")

const cors = require("cors");
const corsOptions = {
  origin: "*",
  credentials: true,
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));

const Hotel = require("./schema/hotelSchema")
app.use(express.json())

initialization()

async function createHotel(newHotel){
    try{   
        const hotel = new Hotel(newHotel)
        const saveHotel = await hotel.save()
        return saveHotel
    }catch(error){
        throw error
    }
}

app.post("/hotels", async (req, res)=>{
    try{
        const saveHotel = await createHotel(req.body)
        res.status(202).json({message: "Hotel added successfully.", hotel: saveHotel})
    }catch(error){
        console.error("DataBase Error", error)
        res.status(500).json({error: "Failed to Add Hotel"})
    }   
})

async function readAll(){
    try{
        const readHotel = await Hotel.find({})
        return readHotel
    }catch(error){
        console.log(error)
    }
}

app.get("/hotels", async (req, res)=>{
    try{
        const hotel = await readAll()
        if(hotel.length != 0){
            res.json(hotel)
        }else{
            res.status(400).json({error: "No hotel found."})
        }

    }catch(error){
        res.status(500).json({error: "Failed to fetch restaurants."})
    }
})

async function hotelName(nameHotel){
    try{
        const name = await Hotel.findOne({name : nameHotel})
        return name
    }catch(error){
        console.log(error)
    }
}

app.get("/hotels/:hotelName", async (req, res)=>{
    try{
        const hotel = await hotelName(req.params.hotelName)
        if(hotel){
            res.json(hotel)
        }else{
            res.status(400).json({error: "Hotel Name not found."})
        }
    }catch(error){
        res.status(500).json({error: "Failed to fetch Name"})
    }
})

async function hotelphoneNo(phone){
    try{
        const phoneNumber = await Hotel.findOne({phoneNumber: phone})
        return phoneNumber
    }catch(error){
        throw error
    }
}

app.get("/hotels/directory/:phoneNumber", async (req, res)=>{
    try{
        const phone = await hotelphoneNo(req.params.phoneNumber)
        if(phone){
            res.json(phone)
        }else{
            res.status(400).json({error: "Hotel PhoneNumber not found."})
        }
    }catch(error){
        res.status(500).json({error: "Faild to fetch Hotels Numbers."})
    }
})

async function hotelRating(rating){
    try{
        const hotelRating = await Hotel.findOne({rating: rating})
        return hotelRating
    }catch(error){
        throw error
    }
}

app.get("/hotels/rating/:hotelRating", async (req, res)=>{
    try{
        const ratingHotel = await hotelRating(req.params.hotelRating)
        if(ratingHotel){
            res.send(ratingHotel)
        }else{
            res.status(404).json({error: "Hotel Rating not found."})
        }
    }catch(error){
        res.status(500).json({error: "failed to fetch Rating."})
    }
})

async function hotelCategory(categoryHotel){
    try{
        const category = await Hotel.findOne({category: categoryHotel})
        return category
    }catch(error){
        console.log(error)
    }
}

app.get("/hotels/category/:hotelCategory", async (req, res)=>{
    try{
        const hotel = await hotelCategory(req.params.hotelCategory)
        if(hotel){
            res.send(hotel)
        }else{
            res.status(404).json({error: "Hotel Category not found."})
        }
    }catch(error){
        res.status(500).json({error: " Faild to fetch HotelCategory."})
    }
})

async function deleteHotel(HotelId){
    try{
        const deletedHotel = await Hotel.findByIdAndDelete(HotelId)
        return deletedHotel
    }catch(error){
        console.log(error)
    }
}

app.delete("/hotels/:hotelId", async (req, res)=>{
    try{
        const deletedHotel = await deleteHotel(req.params.hotelId)
        if(deletedHotel){
            res.status(200).json({message: "Hotel deleted successfully."})
        }
    }catch(error){
        res.status(500).json({error: "failed to delete Hotel"})
    }
})

async function updateRating(updateId, dateToUpdate){
    try{
        const updatedRating = await Hotel.findByIdAndUpdate(updateId, dateToUpdate, {new: true})
        return updatedRating
    }catch(error){
        console.log("Error in updating Hotel Rating.", error)
    }
}

app.post("/hotels/:hotelId", async (req, res)=>{
    try{
        const updatedRating = await updateRating(req.params.hotelId, req.body)
        if(updatedRating){
            res.status(200).json({message: "Hotel Rating Updated Successfully."})
        }else{
            res.status(404).json({error: "Hotel Rating not found."})
        }
    }catch(error){
        res.status(500).json({error: "failed to update Hotel Rating."})
    }
})

const PORT = 5000
app.listen(PORT, ()=>{
    console.log(`Server is running on ${PORT}`)
})