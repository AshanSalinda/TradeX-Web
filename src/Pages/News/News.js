import React, { useState, useEffect } from 'react'; 
import BasicPage from '../../Components/BasicPage/BasicPage'; 
import NewsItem from '../../Components/NewsBar/NewsItem'; 
import "./News.css"; 
import Input from '../../Components/Input/Input'; 
import axios from 'axios'; 

export default function News() {
  // State to store articles and loading status
  const [articles, setArticles] = useState([]); 
  const [isLoading, setIsLoading] = useState(true); 
  const [search, setSearch] = useState("");

  // Effect to fetch news articles from the API on component mount
  useEffect(() => {
    setIsLoading(true); // Set loading status to true

    // Fetch news articles from the API
    axios.get('https://newsapi.org/v2/everything?q=bitcoin&apiKey=bc6db274836c4c21aa4569104f316c17')
      .then(res => {
        setArticles(res.data.articles); // Set fetched articles in state
        setIsLoading(false); // Set loading status to false
      })
      .catch(error => {
        console.log(error); // Log any errors
        setIsLoading(false); // Set loading status to false
      });
  }, []); // Run effect only once on component mount

  console.log(articles); // Log articles array

  //Check the title
  const filteredNews = articles.filter((news) =>
        news.title.toLowerCase().includes(search.toLowerCase())
    );

  return (
    <BasicPage 
      isLoading={isLoading} // Pass loading status to BasicPage component
      tabs={[
        { label: 'Latest', path: '/news' },
        { label: 'Favourite', path: '/news/favourite' }
      ]}
    >  
      {/* Search input */}
      <div className='search_bar'>
        <Input type={"search"} placeholder={"search"} onChange={(e)=>setSearch(e.target.value)}/>
      </div>  

      {/* Container for news items */}
      <div className='news-container'>
        {/* Render news items */}
        {filteredNews.map((news, index) => (
          <NewsItem key={index} title={news.title} description={news.description} src={news.urlToImage} url={news.url} />
        ))}
      </div> 
    </BasicPage> // Return BasicPage component with loading status and tabs
  );
}
