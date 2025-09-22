import connectionPool from "@/lib/db";
import bcrypt from "bcrypt";

interface RegisteredUser {
    id: string;
    full_name: string;
    email: string;
}

async function registerUser(username: string, email: string, password: string): Promise<RegisteredUser> {
    try {
        const saltRounds = 10;
        const hash = await bcrypt.hash(password, saltRounds);
        
        const result = await connectionPool.query(
            'INSERT INTO users (full_name, email, password_hash) VALUES ($1, $2, $3) RETURNING id, full_name, email',
            [username, email, hash]
        );
        
        if (result.rows.length === 0) {
            throw new Error('Failed to create user');
        }
        
        const user = result.rows[0];
        console.log('User registered successfully:', user.id);
        
        return {
            id: user.id,
            full_name: user.full_name,
            email: user.email
        };
    } catch (error) {
        console.error('Error in registerUser:', error);
        throw error;
    }
}

const loginUser=async (email: string, password: string) => {
  try{
    const result = await connectionPool.query(
      'SELECT id, full_name, email, password_hash FROM users WHERE email = $1',
      [email]
    );
    
    if(result.rows.length === 0){
      throw new Error('User not found');
    }
    const user = result.rows[0];
    const passwordMatch = await bcrypt.compare(password, user.password_hash);
    if(!passwordMatch){
      throw new Error('Invalid password');
    }
    return {
      id: user.id,
      full_name: user.full_name,
      email: user.email
    };
  }
    catch(error){
      console.error('Error in loginUser:', error);
      throw error;

  }
}


export { registerUser, loginUser };