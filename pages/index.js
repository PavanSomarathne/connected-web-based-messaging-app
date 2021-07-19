import Head from "next/head";
import Image from "next/image";
import Sidebar from "../Components/Sidebar";

export default function Home() {
  return (
    <div>
      <Head>
        <title>Connected</title>
        <meta name="description" content="Newly upgraded web messenger" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Sidebar />
    </div>
  );
}
