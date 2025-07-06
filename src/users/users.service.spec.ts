import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { NotFoundException } from '@nestjs/common';

describe('UsersService', () => {
  let service: UsersService;
  let repository: Repository<User>;

  const mockUser = {
    id: 1,
    name: 'Alice',
    email: 'alice@test.com',
    password: 'secret',
    role: 'user',
  } as User;

  const mockRepository = {
    findOneBy: jest.fn(),
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return user by ID', async () => {
    mockRepository.findOneBy.mockResolvedValueOnce(mockUser);
    const result = await service.findOne(1);
    expect(result).toEqual(mockUser);
    expect(repository.findOneBy).toHaveBeenCalledWith({ id: 1 });
  });

  it('should throw if user by ID not found', async () => {
    mockRepository.findOneBy.mockResolvedValueOnce(null);
    await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
  });

  it('should return user by email', async () => {
    mockRepository.findOneBy.mockResolvedValueOnce(mockUser);
    const result = await service.findOneByEmail('alice@test.com');
    expect(result).toEqual(mockUser);
    expect(repository.findOneBy).toHaveBeenCalledWith({
      email: 'alice@test.com',
    });
  });

  it('should throw if user by email not found', async () => {
    mockRepository.findOneBy.mockResolvedValueOnce(null);
    await expect(service.findOneByEmail('notfound@test.com')).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should return user with password by email', async () => {
    mockRepository.findOne.mockResolvedValueOnce(mockUser);
    const result = await service.findByEmailWithPassword('alice@test.com');
    expect(result).toEqual(mockUser);
    expect(repository.findOne).toHaveBeenCalledWith({
      where: { email: 'alice@test.com' },
      select: ['id', 'name', 'email', 'password', 'role'],
    });
  });

  it('should throw if user with password by email not found', async () => {
    mockRepository.findOne.mockResolvedValueOnce(null);
    await expect(
      service.findByEmailWithPassword('notfound@test.com'),
    ).rejects.toThrow(NotFoundException);
  });
});
