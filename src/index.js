import './css/styles.css';
import 'simplelightbox/dist/simple-lightbox.min.css';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import fetchArticles from './components/fetchArticles';
import cardsTpl from './templates/cardsTemplate.hbs';

const formRef = document.querySelector('#search-form');
const loadMoreBtnRef = document.querySelector('.load-more');
const galleryRef = document.querySelector('.gallery');

formRef.addEventListener('submit', onSearch);
loadMoreBtnRef.addEventListener('click', onLoadMoreClick);

let searchValue = '';
let page = 0;
let simpleLightbox;
loadMoreBtnRef.style.display = 'none';

function onSearch(event) {
  event.preventDefault();
  galleryRef.innerHTML = '';
  searchValue = event.currentTarget.elements.searchQuery.value.trim();
  page = 1;

  if (!searchValue) {
    Notiflix.Notify.info('Please enter something');
    galleryRef.innerHTML = '';
    loadMoreBtnRef.style.display = 'none';
    return;
  }

  // fetchArticles(searchValue, page).then(({ hits, totalHits }) => {
  //   if (totalHits === 0) {
  //     Notiflix.Notify.failure(
  //       'Sorry, there are no images matching your search query. Please try again.'
  //     );
  //     return;
  //   }
  //   Notiflix.Notify.info(`Hooray! We found ${totalHits} images.`);
  //   renderArticles(hits);

  //   simpleLightbox = new SimpleLightbox('.gallery .photo-card a', {
  //     captionsData: 'alt',
  //     captionDelay: 250,
  //   });
  //   page += 1;
  //   loadMoreBtnRef.style.display = 'inline-block';
  // });

  async function fetchAndDisplayArticles(searchValue, page) {
    try {
      const { hits, totalHits } = await fetchArticles(searchValue, page);

      if (totalHits === 0) {
        Notiflix.Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
        return;
      }

      Notiflix.Notify.info(`Hooray! We found ${totalHits} images.`);
      renderArticles(hits);

      simpleLightbox = new SimpleLightbox('.gallery .photo-card a', {
        captionsData: 'alt',
        captionDelay: 250,
      });

      page += 1;
      loadMoreBtnRef.style.display = 'inline-block';
    } catch (error) {
      console.error('Error fetching and displaying articles:', error);
    }
  }

  return fetchAndDisplayArticles(searchValue, page);
}

function onLoadMoreClick() {
  fetchArticles(searchValue, page).then(({ hits }) => {
    renderArticles(hits);

    page += 1;
    simpleLightbox.refresh();

    const { height: cardHeight } = document
      .querySelector('.gallery')
      .firstElementChild.getBoundingClientRect();

    window.scrollBy({
      top: cardHeight * 2,
      behavior: 'smooth',
    });
  });
}

function renderArticles(articles) {
  const markup = cardsTpl(articles);
  if (!articles.length) {
    return;
  }
  if (articles.length < 40 && articles.length !== 0) {
    Notiflix.Notify.info(
      "We're sorry, but you've reached the end of search results."
    );
    loadMoreBtnRef.style.display = 'none';
  }
  galleryRef.insertAdjacentHTML('beforeend', markup);
}
