$(document).ready(function() {
  // Gets an optional query string from our url (i.e. ?post_id=23)
  var url = window.location.search;
  var postId;
  // Sets a flag for whether or not we're updating a post to be false initially
  var updating = false;

  // If we have this section in our url, we pull out the post id from the url
  // In localhost:8080/cms?post_id=1, postId is 1
  if (url.indexOf("?post_id=") !== -1) {
    postId = url.split("=")[1];
    getPostData(postId);
  }

  // Getting jQuery references to the post body, workout, form, and category select
  var exerciseInput = $("#exercise");
  console.log(exerciseInput);
  var workoutInput = $("#workout");
  var setsInput = $("#sets");
  var repsInput = $("#reps");
  var cmsForm = $("#cms");
  var postCategorySelect = $("#category");
  // Giving the postCategorySelect a default valuee
  postCategorySelect.val("Yoga");
  // Adding an event listener for when the form is submitted
  $(cmsForm).on("submit", function handleFormSubmit(event) {
    event.preventDefault();
    // Wont submit the post if we are missing an exercise or a workout
    if (!workoutInput.val().trim() || !exerciseInput.val().trim()) {
      return;
    }
    // Constructing a newPost object to hand to the database
    var newPost = {
      workout: workoutInput.val().trim(),
      exercise: exerciseInput.val().trim(),
      sets: setsInput.val().trim(),
      reps: repsInput.val().trim(),
      category: postCategorySelect.val()
    };

    console.log(newPost);

    // If we're updating a post run updatePost to update a post
    // Otherwise run submitPost to create a whole new post
    if (updating) {
      newPost.id = postId;
      updatePost(newPost);
    }
    else {
      submitPost(newPost);
    }
  });

  // Submits a new post and brings user to createWorkout page upon completion
  function submitPost(Post) {
    $.post("/api/posts/", Post, function() {
      window.location.href = "/createWorkout";
    });
  }

  // Gets post data for a post if we're editing
  function getPostData(id) {
    $.get("/api/posts/" + id, function(data) {
      if (data) {
        // If this post exists, prefill our cms forms with its data
        workoutInput.val(data.workout);
        exerciseInput.val(data.exercise);
        setsInput.val(data.sets);
        repsInput.val(data.reps);
        postCategorySelect.val(data.category);
        // If we have a post with this id, set a flag for us to know to update the post
        // when we hit submit
        updating = true;
      }
    });
  }

  // Update a given post, bring user to the createWorkout page when done
  function updatePost(post) {
    $.ajax({
      method: "PUT",
      url: "/api/posts",
      data: post
    })
      .then(function() {
        window.location.href = "/createWorkout";
      });
  }
});
