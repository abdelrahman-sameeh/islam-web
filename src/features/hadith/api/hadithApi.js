import axios from "axios";

const HADEETH_ENC_BASE_URL = "https://hadeethenc.com/api/v1";

const mapHadithDetails = (hadith) => ({
  id: String(hadith.id),
  title: hadith.title,
  text: hadith.hadeeth,
  attribution: hadith.attribution,
  grade: hadith.grade,
  explanation: hadith.explanation,
  benefits: Array.isArray(hadith.hints) ? hadith.hints : [],
  reference: hadith.reference,
});

export const getHadithCategories = async (signal) => {
  const response = await axios.get(
    `${HADEETH_ENC_BASE_URL}/categories/roots/?language=ar`,
    { signal }
  );

  if (!Array.isArray(response.data)) throw new Error("INVALID_CATEGORIES");

  return response.data.map((category) => ({
    id: String(category.id),
    title: category.title,
    count: Number(category.hadeeths_count),
  }));
};

export const getHadithPage = async ({ categoryId, page = 1, signal }) => {
  const response = await axios.get(
    `${HADEETH_ENC_BASE_URL}/hadeeths/list/`,
    {
      params: {
        language: "ar",
        category_id: categoryId,
        page,
        per_page: 12,
      },
      signal,
    }
  );
  const items = response.data?.data;

  if (!Array.isArray(items)) throw new Error("INVALID_HADITH_LIST");

  return {
    items: items.map((hadith) => ({
      id: String(hadith.id),
      title: hadith.title,
    })),
    currentPage: Number(response.data?.meta?.current_page ?? page),
    lastPage: Number(response.data?.meta?.last_page ?? 1),
    totalItems: Number(response.data?.meta?.total_items ?? items.length),
  };
};

export const getHadithDetails = async (hadithId, signal) => {
  const response = await axios.get(
    `${HADEETH_ENC_BASE_URL}/hadeeths/one/`,
    { params: { language: "ar", id: hadithId }, signal }
  );

  if (!response.data?.hadeeth) throw new Error("INVALID_HADITH_DETAILS");
  return mapHadithDetails(response.data);
};

const randomItem = (items) =>
  items[Math.floor(Math.random() * items.length)];

export const getRandomHadith = async (signal) => {
  const categories = await getHadithCategories(signal);
  const category = randomItem(categories.filter(({ count }) => count > 0));
  const firstPageResponse = await axios.get(
    `${HADEETH_ENC_BASE_URL}/hadeeths/list/`,
    {
      params: {
        language: "ar",
        category_id: category.id,
        page: 1,
        per_page: 1,
      },
      signal,
    }
  );
  const lastPage = Number(firstPageResponse.data?.meta?.last_page ?? 1);
  const randomPage = Math.floor(Math.random() * lastPage) + 1;
  const response =
    randomPage === 1
      ? firstPageResponse
      : await axios.get(`${HADEETH_ENC_BASE_URL}/hadeeths/list/`, {
          params: {
            language: "ar",
            category_id: category.id,
            page: randomPage,
            per_page: 1,
          },
          signal,
        });
  const summary = response.data?.data?.[0];

  if (!summary?.id) throw new Error("INVALID_RANDOM_HADITH");
  return getHadithDetails(summary.id, signal);
};
