module.exports = function(sequelize, DataTypes) {
  var Post = sequelize.define("Post", {
    workout: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1]
      }
    },
    exercise: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1]
      }
    },
    sets: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isNumeric: true
      }
    },
    reps: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
         isNumeric: true
      }
    },
    category: {
      type: DataTypes.STRING,
      defaultValue: "Yoga"
    }
  });
  return Post;
};
