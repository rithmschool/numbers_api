import './CategoryContainer.css';
import CategoryCard from './CategoryCard';

/**
* Container for all category components
*
* Props: 
* - None
* State:
* - None
*
*  (CategoryContainer) -> CategoryCard
*/    

function CategoryContainer() {
  return (
    <section id="usage-outer"> 
      <div id="usage">
        <CategoryCard title="math"/>
        <CategoryCard title="trivia"/>
        <CategoryCard title="date"/>
      </div>
    </section>
  )
}

export default CategoryContainer;