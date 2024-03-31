import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import BicyclesList from './components/BicyclesList';
import Layout from './components/Layout';
import NotFound from './components/NotFound';
import Basket from './components/Basket'
import './App.css';
import AddNewBike from './components/AddNewBike';

function App() {
    return (
        <Router>
            <div className="main-content">
                <Routes>
                    <Route path="/login" element={<Login />} />
                    
                    <Route path="/register" element={<Register />} />

                    <Route path="/bicycles" element={
                          <Layout>
                              <BicyclesList />
                          </Layout>
                      } />

                    <Route path="/" element={<Login />} />

                    <Route path='/basket' element={
                          <Layout>
                              <Basket />
                          </Layout>
                      } />

                    <Route path='/add-bike' element={
                          <Layout>
                              <AddNewBike />
                          </Layout>
                      } />

                    <Route path="*" element={<NotFound />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;