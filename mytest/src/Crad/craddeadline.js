import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const CardDeadline = () => {
    const [workData, setWorkData] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:3001/dashboard-deadline')
            .then(response => {
                setWorkData(response.data);
                console.log("dashboard", response.data); // ตรวจสอบข้อมูลที่ได้
            })
            .catch(error => {
                console.error('Error fetching data: ', error);
            });
    }, []);

const handleStatusUpdate = (id) => {
        axios.put(`http://localhost:3001/dashboard/${id}`, { status: 'Successfully' })
            .then(response => {
                setWorkData(prevState =>
                    prevState.map(item => 
                        item.id === id ? { ...item, status: 'Successfully' } : item
                    )
                );
                console.log("Status updated successfully", response.data);
            })
            .catch(error => {
                console.error('Error updating status: ', error);
            });
    };

    const CardComponent = ({ data }) => {
        const imgPath = data.imgPath.replace(/\\/g, '/');
        const startDate = data.startDate.replace(/T/g, ' ');
        const startDates = startDate.replace(/.000Z/g, ' ');
        const endDate = data.endDate.replace(/T/g, ' ');
        const endDates = endDate.replace(/.000Z/g, ' ');

        return (
            <div className="card">
                <img src={'http://localhost:3001/' + imgPath} alt="Employee Preview" className="card-img-top" />
                <div className="card-body">
                    <h5 className="card-text">Project: {data.projectId}</h5>
                    <p className="card-title">{data.employeeId}</p>
                    <p className="card-text">Department: {data.departmentId}</p>
                    <p className="card-text">Details: {data.details}</p>
                    <p className="card-text">Start Date: {startDates}</p>
                    <p className="card-text">End Date: {endDates}</p>
                    <p className="card-text">Status: {data.status}</p>
                    <button className="btn btn-primary" onClick={() => handleStatusUpdate(data.id)}>Successfully</button>
                </div>
            </div>
        );
    };

    return (
        <div className="container">
            <div className="row">
                {workData.map(item => (
                    <div key={item.id} className="col-md-4 mb-3">
                        <CardComponent data={item} />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CardDeadline;
