// Route to book an appointment (example)
router.post("/hospitals/me/bookAppointment", verifyToken, async (req, res) => {
    try {
      const { donorId, appointmentDate, appointmentTime } = req.body;
      
      // Fetch hospital details
      const hospital = await Hospital.findById(req.hospitalId);
      if (!hospital) return res.status(404).json({ message: "Hospital not found" });
  
      // Fetch donor details
      const donor = await Donor.findById(donorId).populate("userId", "email name");
      if (!donor) return res.status(404).json({ message: "Donor not found" });
  
      // Call bookAppointment function
      const result = await bookAppointment(hospital, donor, appointmentDate, appointmentTime);
  
      // Return success response
      return res.status(200).json({ message: result.message });
    } catch (error) {
      console.error("Error booking appointment:", error);
      return res.status(500).json({ message: error.message });
    }
  });
  