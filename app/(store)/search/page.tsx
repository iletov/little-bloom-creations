type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

const SearchPage = async ({
  // params,
  searchParams,
}: {
  // params: Params;
  searchParams: SearchParams;
}) => {
  const query = (await searchParams).query as string;

  // const products = await searchProductsByName(query);
  // const controlls = await getSectionsControler();

  // console.log('products', products);

  return (
    <section className="min-h-screen ">
      <div className="section_wrapper font-montserrat py-6 md:py-8">
        <header className="grid items-center mb-4 md:mb-8 justify-center md:text-[2rem]">
          <h1>Резултати за:</h1>
          <p className="text-center font-bold">{query}</p>
        </header>
      </div>
    </section>
  );
};

export default SearchPage;
