import client from "./lib/db";

async function updateUsernames() {
  try {
    
    const db = client.db();
    const usersCollection = db.collection('users');

    // Find all users who don't have a 'username' field
    const usersWithoutUsername = await usersCollection.find({ username: { $exists: false } }).toArray();

    // Loop through users and add a username
    for (const user of usersWithoutUsername) {
        const username = user.email?.split('@')[0] || `user_${user._id}` // Generate username
      await usersCollection.updateOne(
        { _id: user._id }, 
        { $set: { username } } // Update the user document with the generated username
      );
      console.log(`Updated username for user ${user.email}`);
    }
    
    console.log('Migration complete!');
  } catch (err) {
    console.error('Error during migration:', err);
  } finally {
    
  }
}

updateUsernames()
