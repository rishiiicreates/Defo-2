import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertContactSubmissionSchema, insertDonationSchema } from "@shared/schema";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes
  
  // Get deforestation statistics
  app.get('/api/deforestation-stats', async (req, res) => {
    try {
      const stats = await storage.getDeforestationStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch deforestation statistics" });
    }
  });

  // Get solution actions
  app.get('/api/solutions', async (req, res) => {
    try {
      const solutions = await storage.getSolutionActions();
      res.json(solutions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch solution actions" });
    }
  });

  // Submit contact form
  app.post('/api/contact', async (req, res) => {
    try {
      const contactData = insertContactSubmissionSchema.parse(req.body);
      const submission = await storage.createContactSubmission(contactData);
      res.status(201).json({ success: true, data: submission });
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        res.status(400).json({ message: validationError.message });
      } else {
        res.status(500).json({ message: "Failed to submit contact form" });
      }
    }
  });

  // Submit donation
  app.post('/api/donate', async (req, res) => {
    try {
      const donationData = insertDonationSchema.parse(req.body);
      const donation = await storage.createDonation(donationData);
      res.status(201).json({ success: true, data: donation });
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        res.status(400).json({ message: validationError.message });
      } else {
        res.status(500).json({ message: "Failed to process donation" });
      }
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
