import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function Home() {
  const [url, setLink] = useState('');
  const [userLinks, setUserLinks] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if the user is logged in
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);

    // Fetch user links when the component mounts
    if (token) {
      fetchUserLinks();
    }
  }, []); // Empty dependency array to run once when the component mounts

  const submit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/url/createurl', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'auth-token': localStorage.getItem('token'),
        },
        body: JSON.stringify({ url }),
      });

      if (response.ok) {
        const data = await response.json();
        const shortID = data.id;
        console.log('Short ID:', shortID);

        // After creating the new link, fetch and update the user's links
        fetchUserLinks();
      } else {
        console.log('Error response:', await response.json());
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const fetchUserLinks = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/url/userlinks', {
        headers: {
          'auth-token': localStorage.getItem('token'),
        },
      });

      if (response.status === 200) {
        setUserLinks(response.data);
      } else {
        console.log('Error fetching user links:', response.data);
      }
    } catch (error) {
      console.error('Error fetching user links:', error);
    }
  };

  const logOut = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  return (
    <div className="cont">
      {isLoggedIn ? (
        <div>
          <form action="POST">
            <h1>Enter the link</h1>
            <input
              type="text"
              onChange={(e) => {
                setLink(e.target.value);
              }}
              name="redirecturl"
              placeholder="https://google.com"
            />
            <button type="submit" onClick={submit}>
              Submit
            </button>
          </form>
          <h2>Your Links:</h2>
          <table>
            <thead>
              <tr>
                <th>Original URL</th>
                <th>Shortened URL</th>
                <th>Analytics count</th>
                <th>Validity Status</th>
              </tr>
            </thead>
            <tbody>
              {userLinks.map((link) => (
                <tr key={link.shortId}>
                  <td>{link.redirectURL}</td>
                  <td>{`http://localhost:5000/${link.shortId}`}</td>
                  <td>{link.visitHistory.length}</td>
                  {(new Date() - new Date(link.createdAt)) / (1000 * 60 * 60) >= 48 ? (
                    <td>Expired</td>
                  ) : (
                    <td>Valid</td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
          <button type="button" className="btn btn-primary" onClick={logOut}>
            Logout
          </button>
        </div>
      ) : (
        <div>
            <h1>URL SHORTENER</h1>
          <p>Please log in or signup to use the app.</p>
          <button type="button" className="btn btn-primary" onClick={logOut}>
            Login
          </button>
          <button type="submit" className="btn btn-primary" onClick={()=>{
        window.location.href='/signup';
}}>Signup</button>
        </div>
      )}
    </div>
  );
}
