import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './styles.css';
import { useHistory } from 'react-router-dom';  
import { Modal, Button } from 'react-bootstrap';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rDate, setDate] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [Phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [isValid, setIsValid] = useState(true);
  const history = useHistory();
  const validatePassword = (password) => {
    // Regex: ต้องมีตัวเลข, ตัวอักษรใหญ่, ตัวอักษรเล็ก และภาษาอังกฤษเท่านั้น
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;
    return regex.test(password);
  };

  const slideshowImages = [
    "https://www.tripgether.com/wp-content/uploads/2022/11/Thian-Beach-18-1.jpg",
    "https://scontent.fbkk22-6.fna.fbcdn.net/v/t1.6435-9/117252927_10158380309612226_7100250055721318011_n.jpg?_nc_cat=102&ccb=1-7&_nc_sid=13d280&_nc_eui2=AeHv8IiBqfCe5e7zjhE7H_pyaGdZG-sSmJdoZ1kb6xKYl9w0B9QGNpFrsdW41rxYPIdANVyWDPvpEoYVHRHLTTb8&_nc_ohc=uSfFcrcu0h0Q7kNvgF2w7aM&_nc_ht=scontent.fbkk22-6.fna&oh=00_AYAYJ8-7ghrzJYt-Du4YRu6Jtm7Z98i29cu5PC-8wubawg&oe=66AE5FA5",
    // เพิ่ม URL รูปภาพเพิ่มเติมตามต้องการ
  ];
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % slideshowImages.length);
    }, 10000); // เปลี่ยนภาพสไลด์ทุก 10 วินาที (10000ms)

    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password || !rDate || !email || !Phone || !firstname || !lastname) {
      setMessage('กรุณากรอกข้อมูลให้ครบทุกช่อง');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('http://localhost:3001/register', {
        username,
        password,
        Rdate: rDate,
        email,
        Phone,
        firstname,
        lastname
      });

      if (response.status === 201) {
        setShowModal(true);
        clearForm();
        history.push('/');
      } else {
        setMessage('ลงทะเบียนไม่สำเร็จ');
      }
    } catch (error) {
      if (error.response && error.response.status === 409) {
        setMessage('ชื่อผู้ใช้, อีเมล, หรือเบอร์โทรศัพท์ซ้ำกัน');
      } else {
        setMessage('ลงทะเบียนไม่สำเร็จ');
        console.error(error);
      }
    } finally {
      setLoading(false);
    }
  };

  const clearForm = () => {
    setUsername('');
    setPassword('');
    setDate('');
    setEmail('');
    setPhone('');
    setFirstname('');
    setLastname('');
  };

  return (
    <div className="group">
      <div className='r2'>
        <div className="sliders">
          <img src={slideshowImages[currentSlide]} alt={`Slide ${currentSlide + 1}`} />
        </div>
      </div>
      <div className='r'>
        <h2>ลงทะเบียน</h2>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous"></link>

        <div></div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <div className='pads'>
              <input
                className="form-control"
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className='pads'>
              <input
                className="form-control"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={8}
                required
              />
               {!isValid && <span className="error">Password must contain at least 8 characters, including uppercase, lowercase, and a number.</span>}
            </div>
            <div className='pads'>
              <input
                className="form-control"
                type="text"
                placeholder="Firtname"
                value={firstname}
                onChange={(e) => setFirstname(e.target.value)}
                required
              />
            </div>
            <div className='pads'>
              <input
                className="form-control"
                type="text"
                placeholder="Lastname"
                value={lastname}
                onChange={(e) => setLastname(e.target.value)}
                required
              />
            </div>
            <div className='pads'>
              <input type="date"
                className="form-control"
                value={rDate}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
            <div className='pads'>
              <input
                className="form-control"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className='pads'>
              <input
                className="form-control"
                type="phone"
                placeholder="Phone"
                value={Phone}
                onChange={(e) => setPhone(e.target.value)}
                minLength="10"
                required
              />
            </div>
          </div>
          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? 'Register...' : 'Register'}
          </button>
        </form>
        <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>สถานะการลงทะเบียน</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>ลงทะเบียนสำเร็จ</p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={() => setShowModal(false)}>
              ปิด
            </Button>
          </Modal.Footer>
        </Modal>
        {message && (
          <Modal show={true} onHide={() => setMessage('')}>
            <Modal.Header closeButton>
              <Modal.Title>ข้อผิดพลาด</Modal.Title>
            </Modal.Header>
            <Modal.Body>{message}</Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setMessage('')}>
                ปิด
              </Button>
            </Modal.Footer>
          </Modal>
        )}
      </div>
    </div>
  );
};

export default Register;
