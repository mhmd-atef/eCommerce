import { connect } from "mongoose";

export const dbConnection =connect("mongodb+srv://medo82852@admin:medo82852@cluster0.nfypn.mongodb.net/E-commerce")
.then(() => {
    console.log("Database connected successfully");
});