import React, { useState } from 'react';

const SignUp = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        role: '',
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent default form submission behavior

        try {
            const response = await fetch('/api/auth/sign-up', {  // Replace '/api/signup' with your actual API endpoint
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                // Signup successful - handle success (e.g., redirect, display message)
                console.log('Signup successful');
                // Example: redirect to login page
                // window.location.href = '/login'; 
            } else {
                // Signup failed - handle error (e.g., display error message)
                const errorData = await response.json();
                console.error('Signup failed:', errorData.message || 'An error occurred.');
                // Example: display error message to the user
                // alert(`Signup failed: ${errorData.message || 'An error occurred.'}`);
            }
        } catch (error) {
            console.error('Error during signup:', error);
            // Handle network errors or other exceptions
        }
    };


    return (
        <div>
            <form onSubmit={handleSubmit}> {/* Add form and onSubmit */}
                <input
                    type="text"
                    name="username"         // Add name attribute
                    placeholder="username"
                    value={formData.username} // Bind value to state
                    onChange={handleChange}    // Add onChange handler
                />
                <input
                    type="email"
                    name="email"           // Add name attribute
                    placeholder="email"
                    value={formData.email}   // Bind value to state
                    onChange={handleChange}    // Add onChange handler
                />
                <input
                    type="password"
                    name="password"         // Add name attribute
                    placeholder="password"
                    value={formData.password} // Bind value to state
                    onChange={handleChange}    // Add onChange handler
                />
                <input
                    type="text"
                    name="role"           // Add name attribute
                    placeholder="role"
                    value={formData.role}   // Bind value to state
                    onChange={handleChange}    // Add onChange handler
                />
                <button type="submit">Sign Up</button> {/* Add submit button */}
            </form>
        </div>
    );
};

export default SignUp;