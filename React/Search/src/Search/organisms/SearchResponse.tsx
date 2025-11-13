import "../../styles.css";

const SearchResponseRenderer: React.FC<SearchResponseRendererProps> = ({
  searchResponse,
}) => {
  if (searchResponse.length === 0) return <h3>No data found</h3>;
  return (
    <div className="table">
      <table>
        <thead>
          <td>id</td> <td>Name</td> <td>Price</td>
          id
        </thead>
        {searchResponse.map((each) => (
          <tr>
            <td>{each?.id}</td>
            <td>{each?.name}</td>
            <td>{each?.price}</td>
            <td>{each?.createdAt}</td>
          </tr>
        ))}
      </table>
    </div>
  );
};

export default SearchResponseRenderer;

type SearchItem = {
  id: number;
  name: string;
  price: number;
  createdAt: string;
};

type SearchResponseRendererProps = {
  searchResponse: SearchItem[];
};
