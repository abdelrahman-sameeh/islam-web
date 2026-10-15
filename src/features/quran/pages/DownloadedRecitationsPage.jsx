import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import FeedbackState from "../../../components/feedback/FeedbackState";
import PageHeader from "../../../components/layout/PageHeader";
import {
  listDownloadedQuranAudio,
  removeDownloadedQuranAudio,
} from "../storage/downloadedQuranAudio";
import getReaderPath from "../utils/getReaderPath";

const formatSize = (bytes) => {
  const megabytes = Number(bytes) / (1024 * 1024);
  return `${megabytes.toLocaleString("ar-EG", {
    maximumFractionDigits: 1,
  })} ميجابايت`;
};

const DownloadedRecitationsPage = () => {
  const [downloads, setDownloads] = useState([]);
  const [status, setStatus] = useState("loading");
  const [removingUrl, setRemovingUrl] = useState("");

  const loadDownloads = useCallback(async () => {
    setStatus("loading");
    try {
      const items = await listDownloadedQuranAudio();
      setDownloads(items);
      setStatus(items.length ? "success" : "empty");
    } catch {
      setStatus("error");
    }
  }, []);

  useEffect(() => {
    void loadDownloads();
  }, [loadDownloads]);

  const totalSize = useMemo(
    () => downloads.reduce((total, item) => total + Number(item.size || 0), 0),
    [downloads]
  );

  const handleRemove = async (item) => {
    const shouldRemove = window.confirm(
      `حذف تلاوة ${item.surahName} بصوت ${item.reciterName} من الجهاز؟`
    );
    if (!shouldRemove) return;

    setRemovingUrl(item.audioUrl);
    try {
      const isRemoved = await removeDownloadedQuranAudio(item.audioUrl);
      if (!isRemoved) throw new Error("DOWNLOAD_REMOVE_FAILED");
      const nextDownloads = downloads.filter(
        ({ audioUrl }) => audioUrl !== item.audioUrl
      );
      setDownloads(nextDownloads);
      setStatus(nextDownloads.length ? "success" : "empty");
    } catch {
      setStatus("error");
    } finally {
      setRemovingUrl("");
    }
  };

  return (
    <main className="page content-page">
      <div className="app-container">
        <PageHeader
          eyebrow="استماع دون إنترنت"
          title="التلاوات المحمّلة"
          description="تظل هذه التلاوات محفوظة على جهازك حتى تحذفها بنفسك."
          action={
            <Link className="secondary-button" to="/quran">
              العودة إلى القرآن
            </Link>
          }
        />

        <section className="downloads-summary" aria-label="مساحة التلاوات المحملة">
          <span>المحفوظ على الجهاز</span>
          <strong>
            {downloads.length.toLocaleString("ar-EG")} تلاوات · {formatSize(totalSize)}
          </strong>
          <small>
            التشغيل العادي بث مباشر ولا يحفظ ملفات؛ الحفظ يتم فقط من زر «حفظ على الجهاز».
          </small>
        </section>

        {status === "loading" && (
          <FeedbackState title="جاري قراءة التلاوات المحمّلة..." />
        )}
        {status === "error" && (
          <FeedbackState
            type="error"
            title="تعذّر فتح التلاوات المحمّلة"
            message="حاول مرة أخرى، ولن تُحذف أي تلاوة محفوظة."
            onRetry={loadDownloads}
          />
        )}
        {status === "empty" && (
          <FeedbackState
            type="empty"
            title="لا توجد تلاوات محمّلة بعد"
            message="افتح سورة واضغط «حفظ على الجهاز» لتظل متاحة دون إنترنت."
          />
        )}

        {status === "success" && (
          <section className="downloads-list" aria-label="التلاوات المحملة">
            {downloads.map((item) => (
              <article className="download-card" key={item.audioUrl}>
                <div>
                  <span>{item.surahName}</span>
                  <h2>{item.reciterName}</h2>
                  <p>{formatSize(item.size)} · متاحة دون إنترنت</p>
                </div>
                <div className="download-card__actions">
                  <Link
                    className="secondary-button"
                    to={getReaderPath(item.surahId, item.reciterId)}
                  >
                    فتح التلاوة
                  </Link>
                  <button
                    type="button"
                    className="secondary-button"
                    disabled={removingUrl === item.audioUrl}
                    onClick={() => handleRemove(item)}
                  >
                    <FontAwesomeIcon icon={faTrashCan} aria-hidden="true" />
                    {removingUrl === item.audioUrl ? "جاري الحذف..." : "حذف"}
                  </button>
                </div>
              </article>
            ))}
          </section>
        )}
      </div>
    </main>
  );
};

export default DownloadedRecitationsPage;
