import { Client, Account, Databases } from "appwrite";

const client = new Client();

// Initialize the Appwrite client
client
  .setEndpoint(import.meta.env.VITE_PROJECT_ENDPOINT)
  .setProject(import.meta.env.VITE_PROJECT_ID);

// Create an instance of the Account service
const account = new Account(client);

const databases = new Databases(client);
export { client, account, databases };
