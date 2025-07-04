export const renderIndex =(req,res) => {
  res.render('index')
}

export const renderRegister = (req, res) => {
  res.render('register'); 
};

export const renderLogin = (req, res) => {
  res.render('login');
};


export const renderDashboard = (req,res) => {
  res.render('dashboard')
}

export const renderUserLogin=(req,res)=>{
   res.render('user-login')
}


export const renderUserForgotPassword= (req,res)=>{
   res.render('forgot-password')
}

export const renderResetForm = (req, res) => {
  const { token } = req.query;
  const { adminId } = req.params; 
  res.render('reset-password', { token, adminId });
};

export const renderUserDashboard = (req,res)=>{
   res.render('user-dashboard')
}
