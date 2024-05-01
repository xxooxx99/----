let movies = []; // API에서 가져온 영화 데이터를 저장할 배열 movies 전역 변수로 선언하여 다른 함수들도 접근 가능하도록 함

document.addEventListener("DOMContentLoaded", function () {
  const scrollContainer = document.getElementById("movies-container");

  async function fetchMovies() {
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2ODNmYjVkZmY4ZjAzZjE2Y2E4YjZjYTAwYjdlMTk0ZiIsInN1YiI6IjY2MmYwN2YzN2Q1ZGI1MDEyMzNlNjE2NSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.mbKz0GDzfwp4rLPHveXZon-Yuu9BIq8gP2A5k_FrB9c",
      },
    };
    try {
      // 여러 페이지의 데이터를 저장할 배열, allmovies->moives 배열로 넘어감
      let allMovies = [];

      // 추가 페이지 정보를 로드하기 위한 for 루프
      for (let page = 1; page <= 3; page++) {
        const url = `https://api.themoviedb.org/3/movie/top_rated?language=ko-KR&page=${page}`;
        const response = await fetch(url, options);
        const data = await response.json();

        // 각 페이지의 영화 데이터를 allMovies 배열에 추가
        allMovies = allMovies.concat(data.results);
      }

      // 모든 페이지의 데이터를 movies 변수에 저장 후 화면에 표시
      movies = allMovies;
      displayMovies(movies);
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  }

  function displayMovies(movies) {
    //movies 배열의 데이터를 사용하여 scrollcontainer 에 추가함
    scrollContainer.innerHTML = "";
    movies.forEach((movie) => {
      const movieElement = document.createElement("div");
      movieElement.classList.add("movie-card");
      movieElement.setAttribute("data-id", movie.id); // 영화 ID를 data-id 속성으로 추가
      movieElement.innerHTML = `
                <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title} Poster">
                <h3>${movie.title}</h3>
                <p>${movie.overview}</p>
                <span>평점: ${movie.vote_average}</span>
            `;
      scrollContainer.appendChild(movieElement);

      // 클릭 이벤트 리스너 추가
      movieElement.addEventListener("click", function () {
        const movieId = this.getAttribute("data-id");
        alert("해당 영화의 ID는" + "'" + movieId + "'" + "입니다!"); // 팝업창으로 영화 ID 출력
      });
    });
  }
  console.log(123);
  function searchMovies() {
    const searchTerm = document
      .getElementById("search-input")
      .value.toLowerCase(); //검색창에서 입력된 텍스트값을 lowercase를 통해 모두 소문자로 변환,
    const filteredMovies = movies.filter((movie) =>
      movie.title.toLowerCase().includes(searchTerm)
    ); //movies 객체를 받아 사용자가 입력한 검색값(searchTerm) 과 비교하여 filter
    displayMovies(filteredMovies);
    scrollContainer.scrollLeft = 0; // 검색 후 스크롤 위치 리셋
  }

  document
    .getElementById("search-button")
    .addEventListener("click", searchMovies); //엔터키,마우스 클릭시 searchMovies 함수 호출
  document.getElementById("search-input").addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      searchMovies();
    }
  });

  fetchMovies(); // API 호출하여 데이터 불러오기
});
