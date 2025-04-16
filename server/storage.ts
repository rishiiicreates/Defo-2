import { 
  users, type User, type InsertUser, 
  type DeforestationStat, type InsertDeforestationStat,
  type ContactSubmission, type InsertContactSubmission,
  type Donation, type InsertDonation,
  type SolutionAction
} from "@shared/schema";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Deforestation stats methods
  getDeforestationStats(): Promise<DeforestationStat[]>;
  createDeforestationStat(stat: InsertDeforestationStat): Promise<DeforestationStat>;
  
  // Solution actions methods
  getSolutionActions(): Promise<SolutionAction[]>;
  
  // Contact submission methods
  createContactSubmission(submission: InsertContactSubmission): Promise<ContactSubmission>;
  
  // Donation methods
  createDonation(donation: InsertDonation): Promise<Donation>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private deforestationStats: Map<number, DeforestationStat>;
  private contactSubmissions: Map<number, ContactSubmission>;
  private donations: Map<number, Donation>;
  private solutionActions: SolutionAction[];
  private userCurrentId: number;
  private statsCurrentId: number;
  private contactCurrentId: number;
  private donationCurrentId: number;

  constructor() {
    this.users = new Map();
    this.deforestationStats = new Map();
    this.contactSubmissions = new Map();
    this.donations = new Map();
    
    this.userCurrentId = 1;
    this.statsCurrentId = 1;
    this.contactCurrentId = 1;
    this.donationCurrentId = 1;
    
    // Initialize with sample data
    this.solutionActions = [
      {
        id: 1,
        title: "Support Reforestation",
        description: "Fund tree planting initiatives and support organizations dedicated to forest restoration on a global scale.",
        icon: "plus",
        actionText: "Take Action",
        actionLink: "#donate"
      },
      {
        id: 2,
        title: "Sustainable Consumption",
        description: "Choose products with sustainable forestry certifications and reduce your consumption of products linked to deforestation.",
        icon: "shopping-cart",
        actionText: "Learn How",
        actionLink: "#sustainable"
      },
      {
        id: 3,
        title: "Advocacy & Education",
        description: "Raise awareness about deforestation and support policies that protect forests and indigenous rights.",
        icon: "megaphone",
        actionText: "Spread the Word",
        actionLink: "#contact"
      }
    ];
    
    // Add sample deforestation stats
    this.createDeforestationStat({
      region: "South America",
      year: 2023,
      hectaresLost: 1800000,
      percentOfTotal: 38
    });
    
    this.createDeforestationStat({
      region: "Africa",
      year: 2023,
      hectaresLost: 1200000,
      percentOfTotal: 25
    });
    
    this.createDeforestationStat({
      region: "Asia",
      year: 2023,
      hectaresLost: 950000,
      percentOfTotal: 20
    });
    
    this.createDeforestationStat({
      region: "Other",
      year: 2023,
      hectaresLost: 750000,
      percentOfTotal: 17
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userCurrentId++;
    const user: User = { ...insertUser, id, createdAt: new Date() };
    this.users.set(id, user);
    return user;
  }
  
  // Deforestation stats methods
  async getDeforestationStats(): Promise<DeforestationStat[]> {
    return Array.from(this.deforestationStats.values());
  }
  
  async createDeforestationStat(stat: InsertDeforestationStat): Promise<DeforestationStat> {
    const id = this.statsCurrentId++;
    const newStat: DeforestationStat = { ...stat, id };
    this.deforestationStats.set(id, newStat);
    return newStat;
  }
  
  // Solution actions methods
  async getSolutionActions(): Promise<SolutionAction[]> {
    return this.solutionActions;
  }
  
  // Contact submission methods
  async createContactSubmission(submission: InsertContactSubmission): Promise<ContactSubmission> {
    const id = this.contactCurrentId++;
    const newSubmission: ContactSubmission = { ...submission, id, createdAt: new Date() };
    this.contactSubmissions.set(id, newSubmission);
    return newSubmission;
  }
  
  // Donation methods
  async createDonation(donation: InsertDonation): Promise<Donation> {
    const id = this.donationCurrentId++;
    // Create donation with correct types
    const newDonation: Donation = { 
      id, 
      name: donation.name,
      email: donation.email,
      amount: donation.amount,
      message: donation.message || null, 
      createdAt: new Date() 
    };
    this.donations.set(id, newDonation);
    return newDonation;
  }
}

export const storage = new MemStorage();
