# ShofTV Deployment Guide

## Production Configuration

### Frontend (Vercel)
- **URL**: https://shof-tv.vercel.app/
- **API Endpoint**: https://movie-api73.runasp.net

### Backend API
- **URL**: https://movie-api73.runasp.net
- **Database**: db43476.public.databaseasp.net

## Environment Variables

### Production (.env.production)
```
VITE_API_BASE_URL=https://movie-api73.runasp.net
VITE_API_TIMEOUT=10000
```

### Local Development (.env.local)
```
VITE_API_BASE_URL=http://localhost:5272
VITE_API_TIMEOUT=10000
```

## Deployment Steps

### Frontend Deployment (Vercel)

1. Push changes to GitHub:
   ```bash
   git add .
   git commit -m "your commit message"
   git push origin main
   ```

2. Vercel will automatically deploy from the main branch

3. Configure environment variables in Vercel dashboard:
   - `VITE_API_BASE_URL=https://movie-api73.runasp.net`
   - `VITE_API_TIMEOUT=10000`

### Backend Deployment (RunASP.NET)

1. Update database connection string in `appsettings.json`:
   ```json
   "DBSettings": {
     "SqlServerDB": "Server=db43476.public.databaseasp.net;Database=db43476;User Id=db43476;Password=Dq4+3?gKfP@9;Encrypt=True;TrustServerCertificate=True;MultipleActiveResultSets=True"
   }
   ```

2. Push changes to GitHub:
   ```bash
   git add .
   git commit -m "your commit message"
   git push origin main
   ```

3. Deploy to movie-api73.runasp.net

## CORS Configuration

Ensure the backend allows requests from the frontend domain:

```csharp
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});
```

## Database Setup

Run the SQL schema file to set up the database:
```bash
sqlserver_schema.sql
```

## Testing the Deployment

1. Visit https://shof-tv.vercel.app/
2. Verify movies load from the API
3. Test authentication (login/register)
4. Test booking functionality
5. Test admin operations (if admin user exists)

## Troubleshooting

### CORS Errors
- Verify CORS policy in backend Program.cs
- Check that frontend URL is allowed

### API Connection Errors
- Verify API URL in environment variables
- Check that backend is running at movie-api73.runasp.net
- Verify database connection string is correct

### Authentication Issues
- Clear localStorage and try again
- Verify JWT token configuration in backend
- Check that AccountController endpoints are accessible
