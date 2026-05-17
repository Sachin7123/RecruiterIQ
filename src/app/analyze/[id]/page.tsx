import { AnalysisResultPage } from "./AnalysisResultPage"

type PageProps = {
  params: Promise<{ id: string }>
}

export default async function AnalyzeResultPage({ params }: PageProps) {
  const { id } = await params

  return (
    <main className="min-h-[calc(100vh-4rem)] px-6 pb-24 pt-28">
      <AnalysisResultPage analysisId={id} />
    </main>
  )
}
