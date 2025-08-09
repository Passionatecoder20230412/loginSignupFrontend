   const { DataTypes } = require('sequelize');
   const { sequelize } = require('../config/db'); // Ensure this line is present

   const User = sequelize.define('User ', {
     name: {
       type: DataTypes.STRING,
       allowNull: false
     },
     email: {
       type: DataTypes.STRING,
       allowNull: false,
       unique: true,
       validate: {
         isEmail: true
       }
     },
     password: {
       type: DataTypes.STRING,
       allowNull: false,
       validate: {
         len: [6] // Minimum 6 characters
       }
     },
     otp: {
       type: DataTypes.STRING(4)
     },
     is_verified: {
       type: DataTypes.BOOLEAN,
       defaultValue: false
     }
   }, {
     tableName: 'users',
     timestamps: true, // Enable timestamps
     createdAt: 'created_at', // Map Sequelize's createdAt to created_at
     updatedAt: 'updated_at'  // Map Sequelize's updatedAt to updated_at
   });

   module.exports = User;
   