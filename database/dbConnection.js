import { connect } from "mongoose";

export const dbConnection =connect("mongodb+srv://E-commerce:p0fBE5W5sDiv1Qfk@cluster0.nfypn.mongodb.net/E-commerce")
.then(() => {
    console.log("Database connected successfully");
});