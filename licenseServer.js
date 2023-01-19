// const express = require("express");
import express from "express";
import bodyParser from "body-parser";

const app = express();

app.listen(5000, () => {
  console.log("License server listening on port 3000");
});

app.use(bodyParser.json());

app.post("/licenses/check", (req, res) => {
  const license = req.body.license;
  if (license === "12346") {
    res.json({
      status: "ok",
      valid_till_date: new Date("2023-12-30"),
      check_again_at: 30,
    });
  } else {
    res
      .status(401)
      .json({
        message: "Invalid license key!=...! Reach out to the support team",
        status: "error",
      });
  }
});

// app.get('/licenses', (req, res) => {
//   collection.find().toArray((err, result) => {
//     if (err) {
//       res.status(500).send({ error: 'Error retrieving licenses' });
//     } else {
//       res.send(result);
//     }
//   });
// });

// app.post('/licenses', (req, res) => {
//   collection.insertOne(req.body, (err, result) => {
//     if (err) {
//       res.status(500).send({ error: 'Error creating license' });
//     } else {
//       res.send(result.ops[0]);
//     }
//   });
// });

// app.put('/licenses/:id', (req, res) => {
//   const id = req.params.id;
//   collection.updateOne({ _id: id }, { $set: req.body }, (err, result) => {
//     if (err) {
//       res.status(500).send({ error: 'Error updating license' });
//     } else {
//       res.send({ status: 'OK' });
//     }
//   });
// });

// app.delete('/licenses/:id', (req, res) => {
//   const id = req.params.id;
//   collection.deleteOne({ _id: id }, (err, result) => {
//     if (err) {
//       res.status(500).send({ error: 'Error deleting license' });
//     } else {
//       res.send({ status: 'OK' });
//     }
//   });
// });
