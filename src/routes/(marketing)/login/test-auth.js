// Simple script to test authentication
console.log('Testing authentication flow...');

// Function to test sign-in
async function testSignIn(email, password) {
  try {
    const response = await fetch('/auth/sign-in', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Sign-in successful:', data);
    return data;
  } catch (error) {
    console.error('Sign-in failed:', error);
    return null;
  }
}

// Export the test function
export { testSignIn }; 