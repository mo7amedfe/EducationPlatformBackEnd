# MongoDB Connection Troubleshooting for Vercel

## Common Issues and Solutions

### 1. Connection Timeout Error
**Error**: `MongooseError: Operation buffering timed out after 10000ms`

**Solutions**:
- ✅ **Updated connection configuration** in `src/utils/database.js`
- ✅ **Added connection pooling** for better performance
- ✅ **Disabled mongoose buffering** to prevent timeouts

### 2. MongoDB Atlas Configuration

#### Check Your Connection String
Your current connection string: `mongodb+srv://admin:Memotito78@cluster0.t6noy0u.mongodb.net`

**Issues to verify**:
1. **Missing Database Name**: Add database name to connection string
   ```
   mongodb+srv://admin:Memotito78@cluster0.t6noy0u.mongodb.net/education_platform
   ```

2. **Network Access**: Ensure MongoDB Atlas allows connections from anywhere
   - Go to MongoDB Atlas Dashboard
   - Navigate to Network Access
   - Add `0.0.0.0/0` to allow all IP addresses (for Vercel)

3. **User Permissions**: Verify user has proper permissions
   - Go to Database Access
   - Ensure user has "Read and write to any database" permissions

### 3. Environment Variables Check

Verify these in your Vercel dashboard:

```env
DB_URL=mongodb+srv://admin:Memotito78@cluster0.t6noy0u.mongodb.net/education_platform?retryWrites=true&w=majority
```

**Important additions**:
- Add database name: `/education_platform`
- Add connection options: `?retryWrites=true&w=majority`

### 4. Updated Connection String

Use this updated connection string in Vercel:

```
mongodb+srv://admin:Memotito78@cluster0.t6noy0u.mongodb.net/education_platform?retryWrites=true&w=majority&maxPoolSize=10&serverSelectionTimeoutMS=5000&socketTimeoutMS=45000
```

### 5. Testing Connection

After deployment, test the health endpoint:
```bash
curl https://your-app.vercel.app/health
```

Expected response:
```json
{
  "message": "Server is running",
  "database": "connected",
  "timestamp": "2024-01-XX..."
}
```

### 6. MongoDB Atlas Settings

#### Network Access
1. Go to MongoDB Atlas Dashboard
2. Click "Network Access" in the left sidebar
3. Click "Add IP Address"
4. Click "Allow Access from Anywhere" (0.0.0.0/0)
5. Click "Confirm"

#### Database Access
1. Go to "Database Access"
2. Ensure your user has "Read and write to any database" role
3. If not, click "Edit" and add the role

### 7. Alternative Connection String Format

If the above doesn't work, try this format:
```
mongodb+srv://admin:Memotito78@cluster0.t6noy0u.mongodb.net/education_platform?retryWrites=true&w=majority&appName=Cluster0
```

### 8. Vercel-Specific Optimizations

The updated code includes:
- ✅ Connection pooling
- ✅ Proper timeout settings
- ✅ Serverless-friendly connection handling
- ✅ Connection caching for better performance

### 9. Debugging Steps

1. **Check Vercel Logs**:
   - Go to your Vercel dashboard
   - Click on your project
   - Go to "Functions" tab
   - Check for error messages

2. **Test Locally with Production Variables**:
   ```bash
   # Set environment variables
   export DB_URL="mongodb+srv://admin:Memotito78@cluster0.t6noy0u.mongodb.net/education_platform?retryWrites=true&w=majority"
   
   # Test connection
   npm start
   ```

3. **MongoDB Atlas Logs**:
   - Go to MongoDB Atlas
   - Check "Logs" for connection attempts
   - Look for authentication or network errors

### 10. Final Checklist

- [ ] Updated connection string with database name
- [ ] Added connection options (retryWrites, w=majority)
- [ ] Network access allows all IPs (0.0.0.0/0)
- [ ] User has proper permissions
- [ ] Environment variables set in Vercel
- [ ] Deployed updated code with new database utility

### 11. If Still Having Issues

1. **Try a different database name**:
   ```
   mongodb+srv://admin:Memotito78@cluster0.t6noy0u.mongodb.net/test?retryWrites=true&w=majority
   ```

2. **Check MongoDB Atlas status**:
   - Visit [status.mongodb.com](https://status.mongodb.com)
   - Ensure Atlas is not experiencing issues

3. **Contact Support**:
   - Vercel support for deployment issues
   - MongoDB Atlas support for database issues 