import React, { useEffect, useState } from "react";
import "./App.css";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// import for route user
import {
  LoginPage,
  SignUpPage,
  ActivationPage,
  HomePage,
  ProductsPage,
  BestSellingPage,
  EventsPage,
  FAQPage,
  ProductDetailsPage,
  ProfilePage,
  ShopCreatePage,
  SellerActivationPage,
  ShopLoginPage,
  CheckoutPage,
  PaymentPage,
  OrderSuccessPage,
  OrderDetailsPage,
  TrackOrderPage,
  UserInbox,
} from "./routes/Routes.js";

// import route seller dashboard
import {
  ShopDashboardPage,
  ShopCreateProduct,
  ShopAllProducts,
  ShopCreateEvents,
  ShopAllEvents,
  ShopAllCoupouns,
  ShopPreviewPage,
  ShopAllOrders,
  ShopOrderDetails,
  ShopAllRefunds,
  ShopSettingsPage,
  ShopWithDrawMoneyPage,
  ShopInboxPage
} from "./routes/ShopRoutes.js";

// import admin route
import {
  AdminDashboardPage,
  AdminDashboardUser,
  AdminDashboardSellers,
  AdminDashboardOrders,
  AdminDashboardProducts,
  AdminDashboardEvents,
  AdminDashboardWithDraw,
} from "./routes/AdminRoutes.js"


// protected routes
import ProtectedRoute from "./routes/protectedRoute";
import SellerProtectedRoute from "./routes/SellerProtectedRoute.js";

// redux
import Store from "./redux/store";
import { loadShop, loadUser } from "./redux/actions/user";
import { getAllProducts } from "./redux/actions/product.js";
import { getAllEvents } from "./redux/actions/event.js";
import { ShopHomePage } from "./ShopRoutes.js";
import axios from "axios";
import { server } from "./server.js";
// stripe
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import AdminProtectedRoute from "./routes/protectedAdminRoute.js";

const App = () => {
  const [stripeApiKey, setStripeApiKey] = useState("");
  async function getStripeApiKey() {
    const { data } = await axios.get(`${server}/payment/stripeapikey`);
    setStripeApiKey(data.stripeApiKey);
  }
  useEffect(() => {
    Store.dispatch(loadUser());
    Store.dispatch(loadShop());
    Store.dispatch(getAllProducts());
    Store.dispatch(getAllEvents());
    getStripeApiKey();
  }, []);

  return (
    <>
      <Router>
{/* stripe */}
        {stripeApiKey && (
          <Elements stripe={loadStripe(stripeApiKey)}>
            <Routes>
              <Route
                path="/payment"
                element={
                  <ProtectedRoute>
                    <PaymentPage />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </Elements>
        )}

 {/* user routes */}
        <Routes>
          <Route path="/"                                    element={<HomePage />} />
          <Route path="/sing-up"                             element={<SignUpPage />} />
          <Route path="/activation/:activation_token"        element={<ActivationPage />}/>
          <Route path="/login"                               element={<LoginPage />} />
          <Route path="/product"                             element={<ProductsPage />} />
          <Route path="/product/:id"                         element={<ProductDetailsPage />} />{" "}
          <Route path="/event/:id"                           element={<ProductDetailsPage />} />{" "}
          <Route path="/best-selling"                        element={<BestSellingPage />} />
          <Route path="/events"                              element={<EventsPage />} />
          <Route path="/faq"                                 element={<FAQPage />} />
          <Route path="/profile"                             element={<ProtectedRoute>  <ProfilePage />      </ProtectedRoute>}/>
          <Route path="/user/order/:id"                      element={<ProtectedRoute>  <OrderDetailsPage /> </ProtectedRoute>}/>
          <Route path="/user/track/order/:id"                element={<ProtectedRoute>  <TrackOrderPage /> </ProtectedRoute>}/>
          <Route path="/checkout"                            element={ <ProtectedRoute> <CheckoutPage />     </ProtectedRoute>}/>
          <Route path="/order/success"                       element={<OrderSuccessPage />} />
          <Route path="/seller/activation/:activation_token" element={<SellerActivationPage />}/>
          <Route path="/shop/preview/:id"                    element={<ShopPreviewPage />} />
          <Route path="/inbox"                               element={<UserInbox />} />

 {/* seller dasboard routes */}
          <Route path="/shop-create"                     element={ <ShopCreatePage />} />
          <Route path="/shop-login"                      element={ <ShopLoginPage />} />
          <Route path="/shop/:id"                        element={ <SellerProtectedRoute>  <ShopHomePage />          </SellerProtectedRoute> }  />
          <Route path="/settings"                        element={ <SellerProtectedRoute>  <ShopSettingsPage />      </SellerProtectedRoute> }  />
          <Route path="/dashboard"                       element={ <SellerProtectedRoute>  <ShopDashboardPage />     </SellerProtectedRoute> }  />
          <Route path="/dashboard-products"              element={ <SellerProtectedRoute>  <ShopAllProducts />       </SellerProtectedRoute> }  />
          <Route path="/dashboard-create-product"        element={ <SellerProtectedRoute>  <ShopCreateProduct />     </SellerProtectedRoute> }  />
          <Route path="/dashboard-events"                element={ <SellerProtectedRoute>  <ShopAllEvents />         </SellerProtectedRoute> }  />
          <Route path="/dashboard-create-event"          element={ <SellerProtectedRoute>  <ShopCreateEvents />      </SellerProtectedRoute> }  />
          <Route path="/dashboard-coupouns"              element={ <SellerProtectedRoute>  <ShopAllCoupouns />       </SellerProtectedRoute> }  />
          <Route path="/dashboard-orders"                element={ <SellerProtectedRoute>  <ShopAllOrders />         </SellerProtectedRoute> }  />
          <Route path="/order/:id"                       element={ <SellerProtectedRoute>  <ShopOrderDetails />      </SellerProtectedRoute> }  /> 
          <Route path="/dashboard-refunds"               element={ <SellerProtectedRoute>  <ShopAllRefunds />        </SellerProtectedRoute> }  />
          <Route path="/dashboard-withdraw-money"        element={ <SellerProtectedRoute>  <ShopWithDrawMoneyPage /> </SellerProtectedRoute> }  />
          <Route path="/dashboard-messages"              element={ <SellerProtectedRoute>  <ShopInboxPage />         </SellerProtectedRoute> }  />
          
{/* Admin Routes */}
          <Route path="admin/dashboard"                  element={ <AdminProtectedRoute>   <AdminDashboardPage/>     </AdminProtectedRoute>}   />
          <Route path="admin-users"                      element={ <AdminProtectedRoute>   <AdminDashboardUser/>     </AdminProtectedRoute>}   />
          <Route path="admin-sellers"                    element={ <AdminProtectedRoute>   <AdminDashboardSellers/>  </AdminProtectedRoute>}   />
          <Route path="admin-orders"                     element={ <AdminProtectedRoute>   <AdminDashboardOrders/>   </AdminProtectedRoute>}   />
          <Route path="admin-products"                   element={ <AdminProtectedRoute>   <AdminDashboardProducts/> </AdminProtectedRoute>}   />
          <Route path="admin-events"                     element={ <AdminProtectedRoute>   <AdminDashboardEvents/>   </AdminProtectedRoute>}   />
          <Route path="admin-withdraw-request"           element={ <AdminProtectedRoute>   <AdminDashboardWithDraw/> </AdminProtectedRoute>}   />
      
     </Routes>

        {/* toastify */}
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
        />
      </Router>
    </>
  );
};

export default App;
