export const initapp = async (app, express) => {
  const port = process.env.PORT || 3000;
  app.use(express.json());
  app.use(cors());

  // ✅ استنى الاتصال يتم فعلاً
  await connectDB();

  app.use('/user', userRouter);
  app.use('/feedback', feedbackRouter);
  app.use('/book', bookRooter);
  app.use('/PT', plasementTest);
  app.use('/course', course);
  app.use('/schedule', schedule);
  app.use('/cart', cart);
  app.use('/order', order);
  app.use('/leason', leason);
  app.use('/finalExam', finalExam);
  app.use('/submittedAssignment', submittedAssignmentRoutes);
  app.use('/finalTest', finalTestRoutes);

  app.use('/test', (req, res, next) =>
    res.status(200).json({ message: 'tes' }),
  );

  // Health check endpoint
  app.get('/health', (req, res) => {
    res.status(200).json({
      message: 'Server is running',
      database: isConnected ? 'connected' : 'disconnected',
      timestamp: new Date().toISOString(),
    });
  });

  app.all('*', (req, res, next) =>
    res.status(404).json({ message: '404 Not Found UL' }),
  );

  app.use((err, req, res, next) => {
    if (err) {
      return res.status(err['cause'] || 500).json({ message: err.message });
    }
  });

  // Only start the server if we're not in a serverless environment
  if (process.env.NODE_ENV !== 'production' || process.env.VERCEL !== '1') {
    app.listen(port, () => console.log(`Server listening on port ${port}!`));
  }
};
