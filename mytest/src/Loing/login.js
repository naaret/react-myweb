import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';


const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const history = useHistory();
  const slideshowImages = [
    "https://www.tripgether.com/wp-content/uploads/2022/11/Thian-Beach-18-1.jpg",
    "https://scontent.fbkk22-6.fna.fbcdn.net/v/t1.6435-9/117252927_10158380309612226_7100250055721318011_n.jpg?_nc_cat=102&ccb=1-7&_nc_sid=13d280&_nc_eui2=AeHv8IiBqfCe5e7zjhE7H_pyaGdZG-sSmJdoZ1kb6xKYl9w0B9QGNpFrsdW41rxYPIdANVyWDPvpEoYVHRHLTTb8&_nc_ohc=uSfFcrcu0h0Q7kNvgF2w7aM&_nc_ht=scontent.fbkk22-6.fna&oh=00_AYAYJ8-7ghrzJYt-Du4YRu6Jtm7Z98i29cu5PC-8wubawg&oe=66AE5FA5",
    // Add more image URLs as needed
  ];
  const [currentSlide, setCurrentSlide] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % slideshowImages.length);
    }, 10000); // Change slide every 3 seconds (3000ms)

    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3001/login', { username, password });
      localStorage.setItem('userToken', 'dummyToken');
      console.log(response.data.username);
      localStorage.setItem('username', response.data.username);

      history.push('/dashboard');
    } catch (error) {
      if (error.response && error.response.status === 401) {
        setError('Invalid credentials');
      } else {
        setError('An error occurred. Please try again later.');
      }
    }
  };
  return (
    <div class='group'>
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous"></link>
      <div class='r2'>
        <div class="sliders" >
          <img src={slideshowImages[currentSlide]} alt={`Slide ${currentSlide + 1}`} />
        </div>
      </div>
      <div class='r'>
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <div class="form-group" >
            <div class='pads'>
              <input
                type="email"
                class="form-control"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div> </div>
          <div class="form-group" >
            <div class='pads'>
              <input
                type="password"
                class="form-control"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={8}
                required
              />
            </div></div>
          <button className="btn btn-primary" type="submit">Login</button>
          {error && <p style="color: red;">{error}</p>}
        </form>
        <br></br>
        <button className="btn btn-primary">
          <a href="/register" style={{ textDecoration: 'none', color: 'inherit' }}>
            Register
          </a>
        </button>
      </div>
    </div>

  );
};




export default Login;
