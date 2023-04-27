import Head from "next/head"
import logo from "@/components/logo.png";
export default function FourOFour() {
  return <>
    <Head>
        <title>404 page not found.</title>
    </Head>
	<div className="container flex flex-col items-center justify-center px-5 mx-auto my-8 content-center">
		<div className="max-w-md text-center">
			<h2 className="mb-8 font-extrabold text-9xl text-red-400">
            <img className=""src={logo.src} />
				<span className="sr-only">Error</span>404
			</h2>
			<p className="text-2xl font-semibold md:text-3xl">Sorry, we couldn't find this page.</p>
			<p className="mt-4 mb-8 text-gray-400">But dont worry, you can find plenty of other things on our homepage.</p>
			<a href="/" className="px-8 py-3 font-semibold buttom-primary">Back to homepage</a>
		</div>
	</div>
  </>
}