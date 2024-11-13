import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { Navigate } from 'react-router-dom';
import 'leaflet/dist/leaflet.css';


//Dumindu
import LayoutQAManager from "./components/LayoutQAManager";
import LayoutQATeam from "./components/LayoutQATeam";
import AddQArecord from "./components/AddQArecord";
import AddQAmember from "./components/AddQAmember";
import QARecords from "./components/qaRecords";
import QATeam from "./components/QATeam";
import QAteamDashboard from "./components/QATeamDash.js";
import IncomingBatches from "./components/IncomingBatches";
import QADashboard from "./components/QADash";
import QAStandards from "./components/QAStandardComponent";
import UpdateStandards from './components/updateStandards';
import QAteamLogin from './components/QAteamLogin';
import QAteamProfile from './components/QAteamProfile';
import NotificationModal from "./components/modals/NotificationModal"; 
import AddIncomingBatch from "./components/AddIncomingBatch.js";


import Login from "./components/Login";
import VFDashboard from "./components/VehicleFleetDashboard";
import LayoutVFManager from "./components/LayoutVFManager";
import LayoutDriver from "./components/LayoutDriver";
import VehicleManagement from "./pages/VehicleManagement";
import DriverManagement from "./pages/DriverManagement";
import FuelManagement from "./pages/FuelManagement";
import MaintenanceManagement from "./pages/MaintenanceManagement";
import ExpensesCalculator from "./pages/ExpensesCalculator";
import DriverPage from "./pages/DriverPage";
import DriverProfile from "./pages/DriverProfile.js";
   

import Signup from "./pages/Signup.js";
import OTP from "./pages/OTP.js";
import SignIn from "./pages/SignIn.js";
import Header from "./components/Header.js";
import PrivateRoute from "./components/PrivateRoute.js";
import RecoveryPage from "./pages/Recovery_email.js";
import UserDashboard from "./pages/Dashboard.js";
import RecoveryOTP from "./pages/Recovery_OTP.js";
import RecoveryPassword from "./pages/Recovery_Password.js";
import AdminDashboard from "./pages/Admin_Dashboard.js";
import AddEmployeeForm from "./pages/Add_employee.js";
import EmployeeSignin from "./pages/Employee_SignIn.js";
import Unauthorized from "./pages/Unauthorized.js";

import AddProduct from "./pages/AddProduct";
import ViewProduct from "./pages/ViewProduct";
import AdminView from "./pages/AdminView";
import OffcutDashboard from "./pages/Offcut-Dashboard.js";
import FarmerRequest from "./pages/farmerRequest.js";
import FarmerRequestDB from "./pages/farmerRequestDB.js";
import CustomerRequest from "./pages/customerRequest.js";
import CustomerRequestDB from "./pages/customerRequestDB.js";
import AddStaff from "./components/AddStaff";
import AddStock from "./components/AddStock";
import AllStaff from "./components/AllStaff";
import AllStock from "./components/AllStock";
import WarehouseStaffLayout from "./components/WarehouseStaffLayout";
import WarehouseManagerLayout from "./components/WarehouseManagerLayout";
import InventoryDashboard from "./components/InventoryDashboard";
import ManagerDashboard from "./components/ManagerDashboard";
import DeliveryHistory from "./components/DeliveryHistory";
import UpdateStaff from "./components/UpdateStaff";
import UpdateStocks from "./components/UpdateStocks";
import UnitPrices from "./components/UnitPrices.js";

// Dilakshan
import StoreContextProvider from "./context/StoreContext.js";
import UserHome from "./pages/home/Home.js";
import Product from "./pages/product/Product.js";
import Cart from "./components/CartItems/CartItem.js";
import OrderForm from "./components/Order/OrderForm";
import PaymentPage from "./components/Payment/PaymentPage.js";
import OrderConfirmation from "./components/OrderConfirmation/OrderConfirmation.js";
import MyOrders from "./components/MyOrders/MyOrders.js";
import OrderDetails from "./components/OrderDetails/OrderDetails.js";
import EditOrder from "./components/EditOrder/EditOrder.js";
import Footer from "./components/Footer.js";
import OrderAdmin from "./pages/OrderAdmin.js";

//Praveen
import AddFarmer from "./components/AddFarmer";
import UpdateFarmer from "./components/updateFarmer";
import AllFarmers from "./components/AllFarmers";
import FarmerLogin from "./components/FarmerLogin";
import FarmerLayout from "./components/FarmerLayout";
import AdminLayout from "./components/AdminLayout";
import CropReadinessForm from "./components/CropReadinessForm";
import CropReadinessList from "./components/CropReadinessList";
import PickupRequestForm from "./components/PickupRequestForm";
import AddLand from "./components/AddLand";
import UpdateLand from "./components/UpdateLand";
import LandList from "./components/LandList";
import ViewLand from "./components/ViewLand";
import "leaflet/dist/leaflet.css";
import LandDetails from "./components/LandDetails";
import CropReadinessUpdateForm from "./components/CropReadinessUpdateForm";
import ParentComponents from "./components/ParentComponents";
import PickupRequestList from "./components/PickupRequestList";
import UpdatePickupRequestForm from "./components/UpdatePickupRequestForm";
import AdminPickupRequestList from "./components/AdminPickupRequestList";
import AdminCropReadinessList from "./components/AdminCropReadinessList";
import PickupReadinessChart from "./components/PickupRequestChart";
import AdminDashboardFarmer from "./components/AdminDashboardFarmer";
import FarmerDashboard from "./components/FarmerDashBoard";
import MyProfile from "./components/MyProfile";
import FarmerProfilePage from "./components/FarmerProfilePage.js";
import DriverLogin from "./pages/DriverLogin";
import DriverDashboard from "./components/DriverDashboard.js";
const isAuthenticated = false; // Replace this with your actual authentication logic

// ProtectedRoute definition
const ProtectedRoute = ({ element }) => {
  return isAuthenticated ? element : <Navigate to="/driver-signin" />;
};

// Socket.io connection
const socket = io("http://localhost:3001");

function App() {
  const [showModal, setShowModal] = useState(false);
  const [batchDetails, setBatchDetails] = useState({});
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [showQAModal, setShowQAModal] = useState(false); // For QA record notification
  const [qaRecordDetails, setQARecordDetails] = useState({}); // Store QA record details

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  useEffect(() => {
    // Listen for the new batch event from the backend
    socket.on("new-batch", (batch) => {
      setBatchDetails(batch);
      setShowModal(true); // Open modal when a new batch notification is received
    });

        // Example: socket listener for new QA record notification
        socket.on("new-qa-record", (qaRecord) => {
          // Check if the user is on '/wh-staff/inventory-dashboard' path
            setQARecordDetails(qaRecord);
            setShowQAModal(true); // Show QA record modal when the user is on the dashboard
          });

    // Clean up the socket listener when the component unmounts
    return () => { socket.off("new-batch");
      socket.off("new-qa-record");};
  }, []);

  const closeModal = () => {
    setShowModal(false);
  };

  const closeQAModal = () => setShowQAModal(false);

  return (
    <StoreContextProvider>
      <Router>
        <Header />
        <div className="app-container">
          <div className="content">
            <Routes>
            {/* QA Manager Routes */}
            <Route path="/qa-manager/*" element={<LayoutQAManager />}>
              <Route index element={<QADashboard />} />
              <Route path="incoming-batches" element={<IncomingBatches userRole="QA Manager" />} /> 
              <Route path="add-qarecord" element={<AddQArecord />} />
              <Route path="qa-records" element={<QARecords />} />
              <Route path="qa-team" element={<QATeam />} />
              <Route path="add-qaMember" element={<AddQAmember />} />
              <Route path="qa-standards" element={<QAStandards />} />
              <Route path="qa-standards/update" element={<UpdateStandards />} />
            </Route>

            {/* QA Team Routes */}
            <Route path="/qa-team/*" element={<LayoutQATeam />}>
              <Route index element={<QAteamDashboard />} />
              <Route path="add-qarecord" element={<AddQArecord />} />
              <Route path="qa-records" element={<QARecords />} />
              <Route path="incoming-batches" element={<IncomingBatches userRole="QA Team" />} />
              <Route path="qa-standards" element={<QAStandards />} />
              <Route path="qa-myprofile" element={<QAteamProfile />}/>
            </Route>
            <Route path="qa-team-login" element={<QAteamLogin />}/>

              {/* Vehicle Fleet Management Routes */}
              <Route path="/vehicle-fleet" element={<LayoutVFManager />}>
                <Route index element={<VFDashboard />} />
                <Route
                  path="vehicle-management"
                  element={<VehicleManagement />}
                />
                <Route
                  path="driver-management"
                  element={<DriverManagement />}
                />
                <Route path="fuel-management" element={<FuelManagement />} />
                <Route
                  path="maintenance-management"
                  element={<MaintenanceManagement />}
                />
                <Route
                  path="cost-management"
                  element={<ExpensesCalculator />}
                />
              </Route>
              
              <Route path="/driver-signin" element={<DriverLogin />} />

              <Route path="/driver" element={<LayoutDriver />}>
                <Route index element={<DriverDashboard />} />
                <Route path="driver-page" element={<DriverPage />}/>
                <Route path="profile" element={<DriverProfile />}/>
              </Route>

   

              



              {/* Authentication and Recovery Routes */}
              <Route path="/" element={<UserHome />} />
              <Route path="/OTP" element={<OTP />} />
              <Route path="/sign-up" element={<Signup />} />
              <Route path="/sign-in" element={<SignIn />} />
              <Route path="/recovery-email" element={<RecoveryPage />} />
              <Route path="/recovery-OTP" element={<RecoveryOTP />} />
              <Route path="/recovery-password" element={<RecoveryPassword />} />
              <Route path="/employee-signin" element={<EmployeeSignin />} />
              <Route path="/Unauthorized" element={<Unauthorized />} />

              {/* Admin Routes */}
              <Route path="/add-employee" element={<AddEmployeeForm />} />
              <Route element={<PrivateRoute />}>
                <Route path="/dashboard/profile" element={<UserDashboard />} />
                <Route path="/admin-user" element={<AdminDashboard />} />
              </Route>

              {/* Product Management Routes */}
              <Route path="/add-product" element={<AddProduct />} />
              <Route path="/view-product" element={<ViewProduct />} />
              <Route path="/admin-product" element={<AdminView />} />
              <Route path="/offcut-dashboard" element={<OffcutDashboard />} />

              {/* Other Routes */}
              <Route path="/farmerRequest" element={<FarmerRequest />} />
              <Route path="/farmerRequestDB" element={<FarmerRequestDB />} />
              <Route path="/customerRequest" element={<CustomerRequest />} />
              <Route
                path="/customerRequestDB"
                element={<CustomerRequestDB />}
              />

              {/* User and Order Routes */}
              <Route path="/cart" element={<Cart />} />
              <Route path="/product/:id" element={<Product />} />
              <Route path="/my-orders" element={<MyOrders />} />
              <Route path="/order-details/:orderId" element={<OrderDetails />}/>
              <Route path="/confirmation" element={<OrderConfirmation />} />
              <Route path="/order/:id" element={<OrderForm />} />
              <Route path="/payment" element={<PaymentPage />} />
              <Route path="/edit-order/:orderId" element={<EditOrder />} />
              <Route path="/order-admin" element={<OrderAdmin />} />


              {/*Warehouse Staff layout*/}
              <Route path="/wh-staff" element={<WarehouseStaffLayout />}>
                <Route
                  path="/wh-staff/inventory-dashboard"
                  element={<InventoryDashboard />}
                />
                <Route path="/wh-staff/add-stocks" element={<AddStock />} />
                <Route path="/wh-staff/all-stocks" element={<AllStock />} />
                <Route path="/wh-staff/add-incomingBatch" element={<AddIncomingBatch/>}/>
                <Route
                  path="/wh-staff/update-stocks"
                  element={<UpdateStocks />}
                />
              </Route>

              {/*Warehouse Manager layout*/}
              <Route path="/wh-manager" element={<WarehouseManagerLayout />}>
                <Route
                  path="/wh-manager/manager-dashboard"
                  element={<ManagerDashboard />}
                />
                <Route path="/wh-manager/add-staff" element={<AddStaff />} />
                <Route path="/wh-manager/all-staff" element={<AllStaff />} />
                <Route path="/wh-manager/unit-prices" element={<UnitPrices />} />
                <Route path="/wh-manager/all-stocks" element={<AllStock />} />
                <Route
                  path="/wh-manager/delivery-history"
                  element={<DeliveryHistory />}
                />
                <Route
                  path="/wh-manager/update-staff/:id"
                  element={<UpdateStaff />}
                />
              </Route>

              {/* Farmer Routes */}
              <Route path="/fm_layout" element={<FarmerLayout />}>
                <Route path="addFarmer" element={<AddFarmer />} />

                <Route path="login_farmer" element={<FarmerLogin />} />

                <Route
                  path="farmer-dashboard"
                  element={<FarmerDashboard />}
                />
                <Route path="farmer-profile" element={<MyProfile />} />
                <Route path="farmer/profile" element={<FarmerProfilePage />} />
                <Route path="crop-readiness" element={<CropReadinessForm />} />

                <Route path="pickup-request" element={<PickupRequestForm />} />
                <Route
                  path="pickup_requests-list"
                  element={<PickupRequestList />}
                />
                <Route
                  path="update-pickup-request/:pickupRequestId"
                  element={<UpdatePickupRequestForm />}
                />

                <Route path="land/add" element={<AddLand />} />
                <Route path="land-details/:id" element={<LandDetails />} />

                <Route path="update-land/:id" element={<UpdateLand />} />
                <Route
                  path="cropReadiness"
                  exact
                  element={<CropReadinessList />}
                />

                <Route
                  path="cropReadiness/update/:notificationId"
                  element={<ParentComponents />}
                />

                <Route
                  path="cropReadiness/update/:notificationId"
                  element={<CropReadinessUpdateForm />}
                />

                <Route path="chart" element={<PickupReadinessChart />} />
              </Route>

              {/* Admin Routes */}
              <Route path="/admin" element={<AdminLayout />}>
                {/* Admin dashboard */}
                <Route
                  path="admin-dashboard"
                  element={<AdminDashboardFarmer />}
                />

                {/* View all farmers */}
                <Route path="all-farmers" element={<AllFarmers />} />

                {/* Update farmer details */}
                <Route path="update/:id" element={<UpdateFarmer />} />

                {/* View crop readiness notifications */}
                <Route
                  path="crop-readiness-list"
                  element={<CropReadinessList />}
                />

                {/* Land Management */}
                <Route path="land/add" element={<AddLand />} />
                <Route path="land/update/:id" element={<UpdateLand />} />
                <Route path="land/list" element={<LandList />} />
                <Route path="land/view/:id" element={<ViewLand />} />

                <Route
                  path="all-pickup-requests"
                  element={<AdminPickupRequestList />}
                />
                <Route
                  path="all-crop-readiness"
                  element={<AdminCropReadinessList />}
                />
              </Route>
            </Routes>
          </div>

          {/* Global notification modal for new batch */}
          <NotificationModal
            title="New Batch Arrived"
            message={`Vegetable: ${batchDetails.vegetableType}\nWeight: ${batchDetails.totalWeight} kg\nArrival Date: ${batchDetails.arrivalDate}`}
            show={showModal}
            onClose={closeModal}
          />

<NotificationModal
  title="New QA Record Added"
  message={`New QA Record Added!!\n Vegetable: ${qaRecordDetails.vegetableType}\nGrade A: ${qaRecordDetails.gradeAWeight} kg\nGrade B: ${qaRecordDetails.gradeBWeight} kg\nGrade C: ${qaRecordDetails.gradeCWeight} kg`}
  show={showQAModal}
  onClose={closeQAModal}
/>
        </div>
        <Footer />
      </Router>
    </StoreContextProvider>
  );
}

export default App;
