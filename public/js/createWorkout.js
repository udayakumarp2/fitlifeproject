$(document).ready(function() {
  // createWorkoutContainer holds all of our posts
  var createWorkoutContainer = $(".createWorkout-container");
  var postCategorySelect = $("#category");
  // Click events for the edit and delete buttons
  $(document).on("click", "button.delete", handlePostDelete);
  $(document).on("click", "button.edit", handlePostEdit);
  postCategorySelect.on("change", handleCategoryChange);
  var posts;

  // This function grabs posts from the database and updates the view
  function getPosts(category) {
    var categoryString = category || "";
    if (categoryString) {
      categoryString = "/category/" + categoryString;
    }
    $.get("/api/posts" + categoryString, function(data) {
      console.log("Posts", data);
      posts = data;
      if (!posts || !posts.length) {
        displayEmpty();
      }
      else {
        initializeRows();
      }
    });
  }

  // This function does an API call to delete posts
  function deletePost(id) {
    $.ajax({
      method: "DELETE",
      url: "/api/posts/" + id
    })
      .then(function() {
        getPosts(postCategorySelect.val());
      });
  }

  // Getting the initial list of posts
  getPosts();
  // InitializeRows handles appending all of our constructed post HTML inside
  // createWorkoutContainer
  function initializeRows() {
    createWorkoutContainer.empty();
    var postsToAdd = [];
    for (var i = 0; i < posts.length; i++) {
      postsToAdd.push(createNewRow(posts[i]));
    }
    createWorkoutContainer.append(postsToAdd);
  }

  // This function constructs a post's HTML
  function createNewRow(post) {
    var newPostCard = $("<div>");
    newPostCard.addClass("card");
    var newPostCardHeading = $("<div>");
    newPostCardHeading.addClass("card-header");
    // sets and reps
    // var newPostSetsReps= $("<div>");
    // newPostSetsReps.addClass("reps-sets");

    // end of sets and reps


    var deleteBtn = $("<button>");
    deleteBtn.text("x");
    deleteBtn.addClass("delete btn btn-danger");
    var editBtn = $("<button>");
    editBtn.text("UPDATE EXERCISE");
    editBtn.addClass("edit btn btn-default");
    var newPostworkout = $("<h2>");
    var newPostDate = $("<small>");
    var newPostCategory = $("<h5>");
    newPostCategory.text(post.category);
    newPostCategory.css({
      float: "right",
      "font-weight": "500",
      "margin-top":
      "-15px"
    });
    var newPostCardExercise = $("<div>");
    newPostCardExercise.addClass("card-body");
    var newPostExercise = $("<p>");
    var newPostCardSets = $("<div>");
    newPostCardSets.addClass("card-body");
    var newPostSets = $("<p>");
    var newPostCardReps = $("<div>");
    newPostCardReps.addClass("card-body");
    var newPostReps= $("<p>");
    newPostworkout.text(post.workout + " ");
    newPostExercise.text("Exercise: "+post.exercise+ " ");
    newPostSets.text("Sets: "+post.sets+ " ");
    newPostReps.text("Reps: "+post.reps+ " ");

   
    var formattedDate = new Date(post.createdAt);
    formattedDate = moment(formattedDate).format("MMMM Do YYYY, h:mm:ss a");
    newPostDate.text(formattedDate);
    newPostworkout.append(newPostDate);
    newPostCardHeading.append(deleteBtn);
    newPostCardHeading.append(editBtn);
    newPostCardHeading.append(newPostworkout);
    newPostCardHeading.append(newPostExercise);
    newPostCardHeading.append(newPostCategory);
    newPostCardExercise.append(newPostExercise);
    newPostCardReps.append(newPostReps);
    newPostCardSets.append(newPostSets);
    newPostCard.append(newPostCardHeading);
    newPostCard.append(newPostCardExercise);
    newPostCard.append(newPostCardSets);
    newPostCard.append(newPostCardReps);
    newPostCard.data("post", post);
    return newPostCard;
  }

  // This function figures out which post we want to delete and then calls
  // deletePost
  function handlePostDelete() {
    var currentPost = $(this)
      .parent()
      .parent()
      .data("post");
    deletePost(currentPost.id);
  }

  // This function figures out which post we want to edit and takes it to the
  // Appropriate url
  function handlePostEdit() {
    var currentPost = $(this)
      .parent()
      .parent()
      .data("post");
    window.location.href = "/cms?post_id=" + currentPost.id;
  }

  // This function displays a message when there are no posts
  function displayEmpty() {
    createWorkoutContainer.empty();
    var messageH2 = $("<h2>");
    messageH2.css({ "text-align": "center", "margin-top": "50px" });
    messageH2.html("Be the first to create a post!!!!! <a href='/cms'>Click here</a> in order to create a new post.");
    createWorkoutContainer.append(messageH2);
  }

  // This function handles reloading new posts when the category changes
  function handleCategoryChange() {
    var newPostCategory = $(this).val();
    getPosts(newPostCategory);
  }

});
