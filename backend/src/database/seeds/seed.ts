import { DataSource } from 'typeorm';
import { faker } from '@faker-js/faker/locale/pt_BR';
import { Producer } from '../../producers/entities/producer.entity';
import { Farm } from '../../farms/entities/farm.entity';
import { PlantedCrop } from '../../farms/entities/planted-crop.entity';

export async function seedDatabase(dataSource: DataSource) {
  const producerRepository = dataSource.getRepository(Producer);
  const farmRepository = dataSource.getRepository(Farm);
  const plantedCropRepository = dataSource.getRepository(PlantedCrop);

  // Criar produtores
  const producers: Producer[] = [];
  for (let i = 0; i < 10; i++) {
    const producer = producerRepository.create({
      name: faker.person.fullName(),
      document: faker.helpers.arrayElement([
        faker.string.numeric(11), // CPF
        faker.string.numeric(14), // CNPJ
      ]),
    });
    producers.push(await producerRepository.save(producer));
  }

  // Estados brasileiros
  const states = ['SP', 'MG', 'RS', 'PR', 'SC', 'GO', 'MT', 'MS', 'BA', 'PE'];

  // Culturas comuns
  const crops = [
    'Soja',
    'Milho',
    'Café',
    'Cana-de-açúcar',
    'Algodão',
    'Arroz',
    'Feijão',
    'Trigo',
  ];

  // Criar fazendas
  const farms: Farm[] = [];
  for (let i = 0; i < 20; i++) {
    const totalArea = faker.number.float({
      min: 100,
      max: 5000,
      precision: 0.01,
    });
    const arableArea = faker.number.float({
      min: 50,
      max: totalArea * 0.8,
      precision: 0.01,
    });
    const vegetationArea = faker.number.float({
      min: 10,
      max: totalArea - arableArea,
      precision: 0.01,
    });

    const farm = farmRepository.create({
      name: `Fazenda ${faker.company.name()}`,
      city: faker.location.city(),
      state: faker.helpers.arrayElement(states),
      totalAreaHectares: totalArea,
      arableAreaHectares: arableArea,
      vegetationAreaHectares: vegetationArea,
      producerId: faker.helpers.arrayElement(producers).id,
    });
    farms.push(await farmRepository.save(farm));
  }

  // Criar culturas plantadas
  for (const farm of farms) {
    const numCrops = faker.number.int({ min: 1, max: 3 });
    const selectedCrops = faker.helpers.arrayElements(crops, numCrops);

    for (const cropName of selectedCrops) {
      const plantedCrop = plantedCropRepository.create({
        cropName,
        harvestSeason: `Safra ${faker.number.int({ min: 2020, max: 2024 })}`,
        farmId: farm.id,
      });
      await plantedCropRepository.save(plantedCrop);
    }
  }

  console.log('✅ Banco de dados populado com sucesso!');
  console.log(`📊 ${producers.length} produtores criados`);
  console.log(`🏡 ${farms.length} fazendas criadas`);
  console.log(`🌾 Culturas plantadas adicionadas`);
}
