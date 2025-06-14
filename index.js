import express from 'express'
import morgan from 'morgan'
import multer from 'multer'
import jwt from 'jsonwebtoken'
import path from 'path'
import * as dotenv from 'dotenv'
import bodyParser from 'body-parser'
import mongoose from 'mongoose'
import cookieParser from 'cookie-parser'
import { contactUS } from './handlers/contactUs.js'
import { comparePasswords, hashPassword, protect, checkLogin, createJWT, userCheck } from './handlers/auth.js'
import { Student } from './models/student.js'
import { createStudent } from './handlers/studentSignup.js'
import { verifyStudent } from './handlers/verifyStudent.js'
import { createIndustry } from './handlers/createIndustry.js'
import { verifyIndustry } from './handlers/verifyIndustry.js'
import { createTeam } from './handlers/createTeam.js'
import { verifyTeam } from './handlers/verifyTeam.js'
import { Post } from './models/post.js'
import { Problem } from './models/problem.js'
import { Solution } from './models/solution.js'

import { Internship } from './models/internships.js'
import { renderForgotPassword, handleForgotPassword, handleResetPassword } from './handlers/passwordReset.js'
import nodemailer from 'nodemailer'
import { getStudentCount } from './handlers/getStudent.js'
import { Team } from './models/verifyTeam.js'
import { Industry } from './models/industry.js'

dotenv.config()
const storage = multer.diskStorage({
  destination: './public/uploads/',
  filename: function(req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });
const app = express()
app.use(cookieParser())
// app.use(morgan('dev'))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json());
app.use('/public', express.static(process.cwd() + '/public'));
app.use('/infra', express.static(process.cwd() + '/public/infra'));
app.use('/img', express.static(process.cwd() + '/public/img'));
app.use('/uploads', express.static(process.cwd() + '/public/uploads'));

app.set('view engine', 'ejs')


app.get("/", checkLogin, async (req, res) => {
  try {
    const studentCount = await getStudentCount();
    if (req.user) {
      res.render('dashboard', {
        user: req.user,
        studentCount: studentCount || 0
      });
    } else {
      res.render('index', {
        user: null,
        studentCount: studentCount || 0
      });
    }
  } catch (error) {
    console.error('Error rendering page:', error);
    if (req.user) {
      res.render('dashboard', {
        user: req.user,
        studentCount: 0
      });
    } else {
      res.render('index', {
        user: null,
        studentCount: 0
      });
    }
  }
});

app.get("/user", userCheck, protect, (req, res) => {
  console.log(req.user)
  res.render("dashboard", {
    user: req.user
  });
})


//hackathon page
app.get('/hackathon', protect, (req, res) => {
  res.render('hack2', {
    user: req.user
  });
})


app.get("/infra", protect, (req, res) => {
  res.render("infraStructure", {
    user: req.user
  })
})


app.post("/login", (req, res) => {
  res.render('login')
})


app.get('/home', protect, (req, res) => {
  res.render('dashboard', {
    user: req.user
  })
})

app.get('/dashboard', protect, async (req, res) => {
  try {
    const studentCount = await getStudentCount();
    res.render('dashboard', { 
      user: req.user,
      studentCount: studentCount || 0 // Ensure we always pass a number
    });
  } catch (error) {
    console.error('Error rendering dashboard:', error);
    res.render('dashboard', { 
      user: req.user,
      studentCount: 0
    });
  }
});
app.post("/login/student", verifyStudent)
// app.post("/login/industry",verifyIndustry)
app.post("/login/industry", verifyIndustry)
// app.post("/login/team",verifyTeam)
app.post("/login/team", (req, res) => {
  res.render('working')
})



// Middleware to check if user is industry
const isIndustry = (req, res, next) => {
    if (req.user && req.user.role === 'Industry') {
        next();
    } else {
        res.redirect('/dashboard');
    }
};

// Protected problem route for industry users
app.get('/problem', protect, isIndustry, (req, res) => {
    console.log('Rendering problem page for industry user:', req.user.id);
    res.render('ind', { user: req.user });
});

// Protected POST route for problem submissions
app.post('/problem', protect, isIndustry, upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            res.status(400).send("No file uploaded");
            return;
        }
        const problem = new Problem({
            title: req.body.title,
            department: req.body.department,
            description: req.body.description,
            image: req.file ? req.file.filename : null,
            industrialist: req.body.userId
        });
        await problem.save();
        console.log(problem)
        res.send("successfully problem is uploaded");
    } catch (error) {
        console.error('Error submitting problem:', error);
        res.status(500).send('Error submitting problem');
    }
});

app.get('/explore', protect, (req, res) => {

  res.render('explore', {
    user: req.user
  })
})

//solution submit page
//solution submit page
app.get('/submit/:id', protect, async (req, res) => {
  const reqProblemID = req.params.id;
  try {
    const userDetails = await Student.findById(req.user.id);

    //checking whether student has
    if (!userDetails) {
      res.render('user', {
        loginError: undefined,
        registerError: undefined,
        successMessage: undefined,
        isSignup: false
      });
      return;
    } else {
      console.log("userDetails", userDetails);
      res.render('solution', {
        user: userDetails, id: reqProblemID
      });
    }
  } catch (e) {
    console.error(e);
    res.render('user', {
      loginError: undefined,
      registerError: undefined,
      successMessage: undefined,
      isSignup: false
    });
    return;
  }
});

//submitting solution to a problem
app.post("/solution/:id", upload.single('file'), protect, async (req, res) => {
  try {
    console.log(req.file);
    if (!req.file) {
      res.status(400).send("No file uploaded");
      return;
    }
    const solution = new Solution({
      department: req.body.department,
      problemStatementID: req.params.id,
      file: req.file ? req.file.filename : null,
      description: req.body.description,
      userId: req.user.id
    });
    await solution.save();
    console.log(solution)
    res.send("successfully solution is uploaded");
  } catch (err) {
    console.error(err);
    res.status(500).send("An error occurred while saving the post");
  }
});

//view all solutions of a particular problem statement
app.get('/explore/problems/:id', protect, async (req, res) => {
  const reqProblemID = req.params.id;
  try {
    const solutions = await Solution.find({ problemStatementID: reqProblemID });
    res.render('solutions', {
      solutions: solutions
    })
  } catch (err) {
    console.error(err);
    res.status(500).send("An error occurred while retrieving the post");
  }
});

//searching for problems based on tags or title
app.get('/explore/search', protect, async (req, res) => {
  const query = req.query.q;
  try {
    const problems = await Problem.find({ title: query });
    res.render('search', {
      problems: problems
    })
  } catch (err) {
    console.error(err);
    res.status(500).send("An error occurred while retrieving the post");
  }
});

//delete a problem statement
app.post("/admin/problems/:id", protect, async (req, res) => {
  const reqProblemID = req.params.id;
  try {
    await Problem.findByIdAndDelete(reqProblemID);
    res.send("successfully problem is deleted");
  } catch (err) {
    console.error(err);
    res.status(500).send("An error occurred while deleting the post");
  }
});






app.get('/personal', protect, async (req, res) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      res.render('user', {
        loginError: undefined,
        registerError: undefined,
        successMessage: undefined,
        isSignup: false
      });
      return;
    }

    try {
      const user = jwt.verify(token, process.env.JWT_SECRET)
      console.log(user)
      const student = await Student.findById(user.id).select('-password');
      console.log(student)
      res.render('personal', {
        user: student
      })
    } catch (e) {
      console.error(e)
      res.render('user', {
        loginError: undefined,
        registerError: undefined,
        successMessage: undefined,
        isSignup: false
      });
      return

    }

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'An error occurred while retrieving the user profile' });
  }
});

app.get('/profile', protect, async (req, res) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      res.render('user', {
        loginError: undefined,
        registerError: undefined,
        successMessage: undefined,
        isSignup: false
      });
      return;
    }

    try {
      const user = jwt.verify(token, process.env.JWT_SECRET)
      console.log(user)
      const student = await Student.findById(user.id).select('-password');
      if (!student) {
        console.error('No student found with this id');
        res.render('user', {
          loginError: undefined,
          registerError: undefined,
          successMessage: undefined,
          isSignup: false
        });
        return;
      }
      console.log(student)
      res.render('personal', {
        user: student
      })
    } catch (e) {
      console.error(e)
      res.render('user', {
        loginError: undefined,
        registerError: undefined,
        successMessage: undefined,
        isSignup: false
      });
      return

    }

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'An error occurred while retrieving the user profile' });
  }
});

app.get('/infraseek', (req, res) => {
  res.render('infraseek')
})

app.post('/update-profile', protect, async (req, res) => {
  try {
    const updatedUser = await Student.findOneAndUpdate(
      { _id: req.user.id },
      {
        name: req.body.name,
        email: req.body.email,
        collegeName: req.body.collegeName,
        stream: req.body.stream,
        branch: req.body.branch,
        phone: req.body.phone,
        currentYear: req.body.currentYear,
        passedOutYear: req.body.passedOutYear,
        image: req.body.avatar,
      },
      { new: true }
    );

    const token = createJWT(updatedUser)
    res.cookie('token', token, { httpOnly: true, maxAge: 7000000 });

    res.render('personal', { success: true, user: updatedUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'An error occurred while updating the user profile' });
  }
});


app.post("/student/signup", createStudent)

// app.post("/industry/signup",createIndustry)
app.post("/industry/signup", createIndustry)

// app.post("/verify/signup",createTeam)
app.post("/verify/signup", (req, res) => {
  res.render('working')
})


// Configure nodemailer transporter
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: 'uncalledinnovators@gmail.com',
    pass: process.env.EMAIL_PASSWORD
  },
  tls: {
    rejectUnauthorized: false // Only for development, remove in production
  }
});

// Verify transporter connection
transporter.verify(function(error, success) {
  if (error) {
    console.error('SMTP connection error:', error);
  } else {
    console.log('SMTP server is ready to take our messages');
  }
});

// Contact form handler
app.post("/contact", contactUS);

//blogs

app.get("/blogs", protect, async function(req, res) {
  try {
    const posts = await Post.find({});
    res.render("showBlogs", {
      posts: posts,
      startingContent: "Welcome to Uncalled Innovators",
      user: req.user,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("An error occurred while retrieving posts");
  }


});

//internship insert
app.get('/internships', protect, async (req, res) => {
  try {
    const internships = await Internship.find();
    console.log(internships)
    if (!internships) {
      res.status(404).send("Internships not found");
      return;
    }
    res.render('internships', { intern: internships });
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while retrieving internships");
  }
});

app.get("/insertInternships", (req, res) => {
  res.render("insertInternship")
});
app.post('/insertInternship', async (req, res) => {
  try {
    const internship = new Internship(
      {
        day: req.body.day,
        company: req.body.companyName,
        description: req.body.description,
        link: req.body.link
      }
    );
    await internship.save();
    res.json(internship);
  } catch (error) {
    console.log(error);
    res.status(500).send("An error occurred while saving the internship");
  }
});

app.get("/blogs/compose", protect, function(req, res) {
  res.render("compose", {
    user: req.user
  });
});

app.post("/blogs/compose", protect, upload.single('image'), async function(req, res) {
  try {
    /* if (!req.file) {
      res.status(400).send("No file uploaded");
      return;
    } */
    const post = new Post({
      title: req.body.postTitle,
      content: req.body.postBody,
      image: req.file ? req.file.filename : null,
      userId: req.user.id
    });
    await post.save();
    console.log(post)
    res.redirect("/blogs");
  } catch (err) {
    console.error(err);
    res.status(500).send("An error occurred while saving the post");
  }
});
app.get('/temp', (req, res) => {
  res.render('tempBlog')
})

app.get("/blogs/posts/:id", async function(req, res) {
  const reqPostID = req.params.id;
  try {
    const post = await Post.findOne({ _id: reqPostID });
    res.render("post", {

      post: post

    });

  } catch (err) {
    console.error(err);
    res.status(500).send("An error occurred while retrieving the post");
  }
});

app.get('/logout', protect, (req, res) => {
  res.clearCookie('token');
  res.redirect('/');
});

// Auth routes
app.post('/auth/login', async (req, res) => {
  const { email, password, 'login-type': loginType } = req.body;
  console.log('Login attempt:', { email, loginType });
  
  if (!email || !password || !loginType) {
    return res.render('user', {
      loginError: 'All fields are required',
      registerError: undefined,
      successMessage: undefined,
      isSignup: false
    });
  }

  try {
    let Model;
    let role;
    
    switch(loginType) {
      case '1':
        Model = Student;
        role = 'Student';
        break;
      case '2':
        Model = Team;
        role = 'Verify-Team';
        break;
      case '3':
        Model = Industry;
        role = 'Industry';
        break;
      default:
        return res.render('user', {
          loginError: 'Invalid user type',
          registerError: undefined,
          successMessage: undefined,
          isSignup: false
        });
    }
    
    const user = await Model.findOne({ email });
    if (!user) {
      console.log('User not found:', email);
      return res.render('user', {
        loginError: 'Invalid email or password',
        registerError: undefined,
        successMessage: undefined,
        isSignup: false
      });
    }
    
    const isValid = await comparePasswords(password, user.password);
    if (!isValid) {
      console.log('Invalid password for user:', email);
      return res.render('user', {
        loginError: 'Invalid email or password',
        registerError: undefined,
        successMessage: undefined,
        isSignup: false
      });
    }
    
    // Add role if not present
    if (!user.role) {
      user.role = role;
      await user.save();
    }
    
    const token = createJWT(user);
    res.cookie('token', token, { 
      httpOnly: true, 
      maxAge: 7000000,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    });
    
    console.log('Login successful:', { email, role: user.role });
    
    // Redirect based on user role
    if (user.role === 'Industry') {
      console.log('Redirecting industry user to /industry');
      return res.redirect('/industry');
    }
    return res.redirect('/dashboard');
    
  } catch (err) {
    console.error('Login error:', err);
    res.render('user', {
      loginError: 'An error occurred during login. Please try again.',
      registerError: undefined,
      successMessage: undefined,
      isSignup: false
    });
  }
});

app.get('/auth/login', (req, res) => {
  if (req.cookies.token) {
    return res.redirect('/');
  }
  res.render('user', { 
    loginError: undefined, 
    registerError: undefined,
    successMessage: undefined,
    isSignup: false
  });
});

app.post('/auth/signup', async (req, res) => {
  const { email, password, phone, userType } = req.body;
  console.log('Signup attempt:', { email, userType });

  if (!email || !password || !phone || !userType) {
    return res.render('user', {
      loginError: undefined,
      registerError: 'All fields are required',
      successMessage: undefined,
      isSignup: true
    });
  }

  try {
    let Model;
    let role;
    let additionalFields = {};

    switch(userType) {
      case 'seeker':
        Model = Student;
        role = 'Student';
        additionalFields = {
          name: req.body.name,
          collegeName: req.body.collegeName,
          stream: req.body.stream,
          branch: req.body.branch,
          currentYear: req.body.currentYear,
          passedOutYear: req.body.passedOutYear
        };
        break;
      case 'verify':
        Model = Team;
        role = 'Verify-Team';
        break;
      case 'industry':
        Model = Industry;
        role = 'Industry';
        break;
      default:
        return res.render('user', {
          loginError: undefined,
          registerError: 'Invalid user type',
          successMessage: undefined,
          isSignup: true
        });
    }

    // Check if email already exists
    const existingUser = await Model.findOne({ email });
    if (existingUser) {
      return res.render('user', {
        loginError: undefined,
        registerError: 'Email already registered',
        successMessage: undefined,
        isSignup: true
      });
    }

    const hashedPassword = await hashPassword(password);
    
    const userData = {
      email,
      password: hashedPassword,
      phone,
      role,
      ...additionalFields
    };

    const user = await Model.create(userData);
    console.log('User created:', { email, role });

    const token = createJWT(user);
    res.cookie('token', token, {
      httpOnly: true,
      maxAge: 7000000,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    });

    res.redirect('/dashboard');

  } catch (err) {
    console.error('Signup error:', err);
    res.render('user', {
      loginError: undefined,
      registerError: 'An error occurred during registration. Please try again.',
      successMessage: undefined,
      isSignup: true
    });
  }
});

//payment hanlde

// app.post('/create-checkout-session', async (req, res) => {
//   const { product } = req.body;

//   const session = await stripe.checkout.sessions.create({
//     payment_method_types: ['card'],
//     line_items: [
//       {
//         price_data: {
//           currency: 'usd',
//           product_data: {
//             name: product.name,
//             images: [product.image],
//           },
//           unit_amount: product.price,
//         },
//         quantity: 1,
//       },
//     ],
//     mode: 'payment',
//     success_url: 'https://example.com/success',
//     cancel_url: 'https://example.com/cancel',
//   });

//   res.json({ id: session.id });
// });



//try navbar or aside

app.get("/navbar", (req, res) => {
  res.render("try")
})


app.get('/internships', (req, res) => {
  res.render('internships')
})

// Forgot password routes
app.get('/forgot-password', renderForgotPassword)
app.post('/forgot-password', handleForgotPassword)
app.post('/reset-password', handleResetPassword)

// Remove old signup routes since we have a unified route now
app.get('/auth/signup', (req, res) => {
  if (req.cookies.token) {
    return res.redirect('/');
  }
  res.render('user', { 
    loginError: undefined, 
    registerError: undefined,
    successMessage: undefined,
    isSignup: true
  });
});

// Industry dashboard route
app.get('/industry', protect, isIndustry, async (req, res) => {
    try {
        const studentCount = await getStudentCount();
        const totalSolutions = await Solution.countDocuments();
        res.render('industryDashboard', { 
            user: req.user,
            totalInnovators: studentCount || 0,
            totalSolutions: totalSolutions || 0
        });
    } catch (error) {
        console.error('Error rendering industry dashboard:', error);
        res.render('industryDashboard', { 
            user: req.user,
            totalInnovators: 0,
            totalSolutions: 0
        });
    }
});

mongoose.connect(process.env.MONGO_URL)
  .then(() => {
    console.log('app connected to database  succesfully')
    app.listen(process.env.PORT, () => {
      console.log(`server listening on port ${process.env.PORT}`)
    })
  }).catch((err) => {
    console.log(err);
  })
