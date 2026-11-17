import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/Header';
import MenuBar from '../components/MenuBar';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import { commonAPI } from '../services/api';

const MainLayout = () => {
  const [commonData, setCommonData] = useState({
    setting: null,
    latestNews: [],
    categories: [],
  });

  const fetchCommonData = async () => {
    try {
      const response = await commonAPI.getCommonData();
      if (response.data.success) {
        setCommonData({
          setting: response.data.setting,
          latestNews: response.data.latestNews || [],
          categories: response.data.categories || [],
        });
      }
    } catch (error) {
      console.error('Error fetching common data:', error);
    }
  };


  useEffect(() => {
    fetchCommonData();
  }, []);

  return (
    <>
      <Header setting={commonData.setting} latestNews={commonData.latestNews} />
      <MenuBar categories={commonData.categories} />

      <main id="main-content">
        <div className="container">
          <div className="row g-4">
            <div className="col-lg-8">
              <Outlet context={{ ...commonData, refreshCommon: fetchCommonData }} />
            </div>
            <Sidebar
              latestNews={commonData.latestNews}
              categories={commonData.categories}
            />
          </div>
        </div>
      </main>

      <Footer setting={commonData.setting} categories={commonData.categories} />
    </>
  );

};

export default MainLayout;
