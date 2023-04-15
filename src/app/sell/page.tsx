import { SellForm } from '~/components/SellForm'
import { SellSteps } from '~/components/SellSteps'

export default async function SellPage() {
  return (
    <section>
      <SellSteps />

      <section className="pt-10">
        <SellForm />
      </section>
    </section>
  )
}
