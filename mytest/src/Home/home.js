import React, { useState, useEffect } from 'react';
import Header from '../Header/Header';
import axios from 'axios';
import './Home.css';
import { Helmet } from 'react-helmet';


const Home = () => {
    const [departments, setDepartments] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [selectedDepartment, setSelectedDepartment] = useState('');
    const [selectedEmployee, setSelectedEmployee] = useState('');
    const [employeeDetails, setEmployeeDetails] = useState({});
    const [projectId, setProjectId] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [details, setDetails] = useState('');
    const [teams, setTeams] = useState([]);
    const [selectedTeam, setSelectedTeam] = useState('');
    const [teamDetails, setTeamDetails] = useState({});
    const [file, setFile] = useState(null);
    const [department, setDepartment] = useState('ADMIN');

    useEffect(() => {
        axios.get('http://localhost:3001/departments')
            .then(response => {
                setDepartments(response.data);
            })
            .catch(error => {
                console.error('There was an error fetching the department data!', error);
            });
    }, []);

    useEffect(() => {
        axios.get('http://localhost:3001/teams')
            .then(response => {
                setTeams(response.data);
            })
            .catch(error => {
                console.error('There was an error fetching the teams data!', error);
            });
    }, []);

    const handleSubmits = (e) => {
        e.preventDefault();
        const employeeData = {
            firstname: teamDetails.firstname,
            lastname: teamDetails.lastname,
            department: department,
        };

        axios.post('http://localhost:3001/submit-employee', employeeData)
            .then(response => {
                console.log('Employee added successfully', response);
                if (response.status === 200) {
                    if (response.data.message === 'Employee already exists') {
                        alert('Employee already exists');
                    } else {
                        alert('เพิ่มพนักงานเรียบร้อย');
                        setSelectedEmployee('');
                        setEmployeeDetails({});
                    }
                }
            })
            .catch(error => {
                // console.error('มีข้อผิดพลาดในการส่งแบบฟอร์ม!', error);
                alert('ไม่สามารถเพิ่มพนักงานได้');
            });
    };

    const handleDepartmentChange = (event) => {
        const departmentId = event.target.value;
        setSelectedDepartment(departmentId);
        axios.get('http://localhost:3001/employees', { params: { departmentId } })
            .then(response => {
                console.log(response.data);
                setEmployees(response.data);
                setSelectedEmployee('');
                setEmployeeDetails({});
            })
            .catch(error => {
                console.error('There was an error fetching the employee data!', error);
            });
    };

    const handleTeamChange = (event) => {
        const teamId = event.target.value;
        setSelectedTeam(teamId);
        if (teamId) {
            const selectedTeamDetails = teams.find(team => team.id.toString() === teamId.toString());
            setTeamDetails(selectedTeamDetails || {});
        } else {
            setTeamDetails({});
        }
    };

    const handleEmployeeChange = (event) => {
        const employeeId = event.target.value;
        setSelectedEmployee(employeeId);
        if (employeeId) {
            const selectedEmpDetails = employees.find(emp => emp.firstname.toString() === employeeId.toString());
            setEmployeeDetails(selectedEmpDetails || {});
        } else {
            setEmployeeDetails({});
        }
    };
    function handleChange(e) {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);
    }

    const handleSubmit = () => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('departmentId', selectedDepartment);
        formData.append('employeeId', `${employeeDetails.firstname} ${employeeDetails.lastname}`);
        formData.append('projectId', projectId);
        formData.append('startDate', startDate);
        formData.append('endDate', endDate);
        formData.append('details', details);

        axios.post('http://localhost:3001/uploads', formData)
            .then(response => {
                console.log('File uploaded successfully:', response.data);
                if (response.status === 200) {
                    alert("successfully");
                    clearForm();

                }

            })
            .catch(error => {
                console.error('Error uploading file:', error);
            });
    };
    const clearForm = () => {

        setEndDate('');
        setFile(null);
        setSelectedDepartment('');
        setSelectedEmployee('');
        setEmployeeDetails({});
        setProjectId('');
        setStartDate('');
        setDetails('');
        console.log(file);

    };
    return (
        <div>
            <Helmet>
                <link
                    href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
                    rel="stylesheet"
                    integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH"
                    crossorigin="anonymous"
                />
            </Helmet>
            <Header />
            <div className='rd'>
                <div className='df'>
                    <div className='ll'>
                        <h12 htmlFor="departmentSelect">Department: &nbsp;</h12>
                        <div>
                            <select
                                className="form-control"
                                id="departmentSelect"
                                onChange={handleDepartmentChange}
                                value={selectedDepartment}>
                                <option value="">--Select Department--</option>
                                {departments.map(department => (
                                    <option key={department.id} value={department.id}>
                                        {department.department}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className='ll'>
                        <h12 htmlFor="employeeSelect">Employee: &nbsp;</h12>
                        <div>
                            <select
                                className="form-control"
                                id="employeeSelect"
                                onChange={handleEmployeeChange}
                                value={selectedEmployee}
                                disabled={!selectedDepartment}>
                                <option value="">--Select Employee--</option>
                                {employees.map(employee => (
                                    <option key={employee.id} value={employee.id}>
                                        {employee.firstname}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className='ll'>
                            <div className='ll'>
                                <p className='textT'>First Name: &nbsp;</p>
                                <div>

                                    <input
                                        className="form-control"
                                        value={employeeDetails.firstname || ''}
                                        readOnly>
                                    </input>
                                </div>
                            </div>
                            <div className='ll'>
                                <p className='textT'>Last Name: &nbsp;</p>
                                <div>
                                    <input
                                        className="form-control"
                                        value={employeeDetails.lastname || ''}
                                        readOnly>
                                    </input>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='df'>
                    <div className='ll'>
                        <p className='textT'>Project ID: &nbsp;</p>
                        <div>
                            <input
                                className="form-control"
                                type='text'
                                value={projectId}
                                onChange={(e) => setProjectId(e.target.value)}>
                            </input>
                        </div>
                    </div>
                    <div className='ll'>
                        <p className='textT'>Start Date: &nbsp;</p>
                        <div>
                            <input
                                className="form-control"
                                type='date'
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}>
                            </input>
                        </div>
                    </div>
                    <div className='ll'>
                        <p className='textT'>End Date: &nbsp;</p>
                        <div>
                            <input
                                className="form-control"
                                type='date'
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}>
                            </input>
                        </div>
                    </div>
                    <div className='ll'>
                        <h12 htmlFor="inputText">Details: &nbsp;</h12>
                        <textarea
                            id="inputText"
                            name="inputText"
                            rows="2"
                            cols="30"
                            value={details}
                            onChange={(e) => setDetails(e.target.value)}>
                        </textarea>
                    </div>
                </div>
                <div>
                    <div className='ll'>

                        <input type="file" onChange={handleChange} />
                    </div>
                    <div className='ll2'>
                        <div className='btns' > 
                            <button onClick={handleSubmit} className="btn btn-primary">Submit</button>
                        </div>

                    </div>
                </div>
            </div>
            <br></br>
            <div className='rd'>
                <div className='df dt'>
                    <h12 htmlFor="teamsSelect">Teams: &nbsp;</h12>
                    <div>
                        <select
                            className="form-control"
                            id="teamsSelect"
                            onChange={handleTeamChange}
                            value={selectedTeam}>
                            <option value="">--Select Team--</option>
                            {teams.map(team => (
                                <option key={team.id} value={team.id}>
                                    {team.firstname}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>

                        <input
                            className="form-control"
                            name="lastnames"
                            value={teamDetails.lastname || ''}
                            readOnly>
                        </input>


                    </div>
                    <div className='ll'>
                        <div>
                            <h12 for="department">Select Department:</h12>
                        </div>
                        <div className='ll'>
                            <select
                                className="form-control"
                                id="department"
                                name="department"
                                value={department}
                                onChange={(e) => setDepartment(e.target.value)}>
                                <option value="ADMIN">ADMIN</option>
                                <option value="IT">IT</option>
                                <option value="PM">PM</option>
                                <option value="SALE">SALE</option>
                            </select>
                        </div>
                    </div>

                </div>
                <div className=' ll2'>
                    <div className='btns' >
                    <button className=" btn btn-primary" onClick={handleSubmits}>Submits</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
